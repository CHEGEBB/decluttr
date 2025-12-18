const axios = require('axios');
const Order = require('../models/Order'); 

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';

const MPESA_BASE_URL = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const getMpesaToken = async () => {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa token error:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

const generatePassword = () => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
  return { password, timestamp };
};

const initiateStkPush = async (req, res) => {
  try {
    const { phoneNumber, amount, orderId, accountReference, transactionDesc } = req.body;
    
    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number, amount, and orderId are required' 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user && order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this order'
      });
    }

    let formattedPhone = phoneNumber.replace(/\+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }
    if (!formattedPhone.startsWith('254')) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid phone number format. Use 254XXXXXXXXX or 07XXXXXXXX' 
      });
    }

    const token = await getMpesaToken();
    const { password, timestamp } = generatePassword();
    
    const stkPushPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.BASE_URL}/api/payments/callback`,
      AccountReference: accountReference || orderId.substring(0, 12) || 'Decluttr',
      TransactionDesc: transactionDesc || `Payment for order ${orderId.substring(0, 8)}`,
    };

    console.log('Initiating STK Push with payload:', {
      ...stkPushPayload,
      Password: '***hidden***'
    });

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      stkPushPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('M-Pesa response:', response.data);

    order.payment = {
      checkoutRequestID: response.data.CheckoutRequestID,
      merchantRequestID: response.data.MerchantRequestID,
      amount: Math.ceil(amount),
      phoneNumber: formattedPhone,
      status: 'pending',
      initiatedAt: new Date()
    };

    order.paymentStatus = 'pending';
    
    await order.save();

    res.json({
      success: true,
      message: 'STK Push initiated successfully',
      data: {
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage
      },
    });
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data || error.message,
    });
  }
};
const mpesaCallback = async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const checkoutRequestID = Body.stkCallback.CheckoutRequestID;

    const order = await Order.findOne({ 
      'payment.checkoutRequestID': checkoutRequestID 
    });

    if (!order) {
      console.log('Order not found for checkoutRequestID:', checkoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    if (Body.stkCallback.ResultCode === 0) {
      const callbackMetadata = Body.stkCallback.CallbackMetadata.Item;
      
      const paymentData = {
        amount: callbackMetadata.find(item => item.Name === 'Amount')?.Value,
        mpesaReceiptNumber: callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value,
        phoneNumber: callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value,
        transactionDate: callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value,
      };

      console.log('Payment successful:', paymentData);
      let parsedDate = new Date();
      if (paymentData.transactionDate) {
        const dateStr = paymentData.transactionDate.toString();
        parsedDate = new Date(
          dateStr.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            '$1-$2-$3T$4:$5:$6'
          )
        );
      }

      order.payment.status = 'completed';
      order.payment.mpesaReceiptNumber = paymentData.mpesaReceiptNumber;
      order.payment.transactionDate = parsedDate;
      order.paymentStatus = 'completed';
      order.mpesaReceiptNumber = paymentData.mpesaReceiptNumber;
      order.transactionId = paymentData.mpesaReceiptNumber;
      order.paymentDate = parsedDate;  
      order.orderStatus = 'processing';
      
      await order.save();

      console.log('Order updated successfully:', order._id);

    } else {
      console.log('Payment failed/cancelled:', Body.stkCallback.ResultDesc);
      order.payment.status = Body.stkCallback.ResultCode === 1032 ? 'cancelled' : 'failed';
      order.paymentStatus = 'failed';
      
      await order.save();
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  }
};
const queryStkPush = async (req, res) => {
  try {
    const orderId = req.params?.orderId || req.body?.orderId;

    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    if (!order.payment) {
      return res.status(400).json({
        success: false,
        message: 'No payment initiated for this order'
      });
    }
    if (order.payment.status === 'completed' || order.paymentStatus === 'completed') {
      return res.json({
        success: true,
        data: {
          paymentStatus: order.payment.status || order.paymentStatus,
          orderStatus: order.orderStatus,
          transaction: {
            _id: order.payment._id,
            mpesaReceiptNumber: order.payment.mpesaReceiptNumber || order.mpesaReceiptNumber,
            amount: order.payment.amount || order.totalAmount,
            status: order.payment.status || order.paymentStatus,
            transactionDate: order.payment.transactionDate || order.paymentDate
          }
        }
      });
    }
    if (order.payment.checkoutRequestID) {
      const token = await getMpesaToken();
      const { password, timestamp } = generatePassword();

      const queryPayload = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: order.payment.checkoutRequestID,
      };

      try {
        const response = await axios.post(
          `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
          queryPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const mpesaData = response.data;
        if (mpesaData.ResultCode === '0') {
          order.payment.status = 'completed';
          order.payment.mpesaReceiptNumber = mpesaData.MpesaReceiptNumber;
          order.payment.transactionDate = new Date();
          order.paymentStatus = 'completed';
          order.mpesaReceiptNumber = mpesaData.MpesaReceiptNumber;
          order.paymentDate = new Date();
          order.transactionId = mpesaData.MpesaReceiptNumber;
          order.orderStatus = 'processing';
          
          await order.save();

          return res.json({
            success: true,
            data: {
              paymentStatus: 'completed',
              orderStatus: order.orderStatus,
              transaction: {
                _id: order.payment._id,
                mpesaReceiptNumber: order.payment.mpesaReceiptNumber,
                amount: order.payment.amount,
                status: 'completed',
                transactionDate: order.payment.transactionDate
              }
            }
          });
        } else if (mpesaData.ResultCode === '1032') {
          order.payment.status = 'cancelled';
          order.paymentStatus = 'failed';
          await order.save();

          return res.json({
            success: true,
            data: {
              paymentStatus: 'cancelled',
              orderStatus: order.orderStatus,
              transaction: {
                _id: order.payment._id,
                mpesaReceiptNumber: null,
                amount: order.payment.amount,
                status: 'cancelled',
                transactionDate: order.payment.initiatedAt
              }
            }
          });
        } else {
          return res.json({
            success: true,
            data: {
              paymentStatus: order.payment.status,
              orderStatus: order.orderStatus,
              transaction: {
                _id: order.payment._id,
                mpesaReceiptNumber: null,
                amount: order.payment.amount,
                status: order.payment.status,
                transactionDate: order.payment.initiatedAt
              }
            }
          });
        }
      } catch (mpesaError) {
        console.error('M-Pesa query error:', mpesaError.response?.data || mpesaError.message);
        return res.json({
          success: true,
          data: {
            paymentStatus: order.payment.status,
            orderStatus: order.orderStatus,
            transaction: {
              _id: order.payment._id,
              mpesaReceiptNumber: order.payment.mpesaReceiptNumber,
              amount: order.payment.amount,
              status: order.payment.status,
              transactionDate: order.payment.transactionDate || order.payment.initiatedAt
            }
          }
        });
      }
    }
    return res.status(400).json({
      success: false,
      message: 'Payment was not properly initiated'
    });

  } catch (error) {
    console.error('Query error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: error.message,
    });
  }
};
const getPaymentHistory = async (req, res) => {
  try {
    res.json({
      success: true,
      payments: [],
      message: 'Payment history feature coming soon',
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
    });
  }
};

module.exports = {
  initiateStkPush,
  mpesaCallback,
  queryStkPush,
  getPaymentHistory,
};