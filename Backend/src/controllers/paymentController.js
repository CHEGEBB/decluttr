const axios = require('axios');

// M-Pesa Configuration
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
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
    if (!phoneNumber || !amount) {
      return res.status(400).json({ message: 'Phone number and amount are required' });
    }
    let formattedPhone = phoneNumber.replace(/\+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }
    if (!formattedPhone.startsWith('254')) {
      return res.status(400).json({ message: 'Invalid phone number format. Use 254XXXXXXXXX' });
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
      CallBackURL: `${process.env.BASE_URL}/api/payments/mpesa/callback`,
      AccountReference: accountReference || 'Decluttr',
      TransactionDesc: transactionDesc || 'Payment for service',
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      stkPushPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({
      success: true,
      message: 'STK Push initiated successfully',
      data: response.data,
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

    if (Body.stkCallback.ResultCode === 0) {
      const callbackMetadata = Body.stkCallback.CallbackMetadata.Item;
      
      const paymentData = {
        amount: callbackMetadata.find(item => item.Name === 'Amount')?.Value,
        mpesaReceiptNumber: callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value,
        phoneNumber: callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value,
        transactionDate: callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value,
      };

      console.log('Payment successful:', paymentData);
    } else {
      console.log('Payment failed:', Body.stkCallback.ResultDesc);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  }
};

const queryStkPush = async (req, res) => {
  try {
    const { checkoutRequestID } = req.body;

    if (!checkoutRequestID) {
      return res.status(400).json({ message: 'CheckoutRequestID is required' });
    }

    const token = await getMpesaToken();
    const { password, timestamp } = generatePassword();

    const queryPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      queryPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Query error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: error.response?.data || error.message,
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