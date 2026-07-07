const axios = require("axios");

const mpCtrl = {};

mpCtrl.getSubscriptionLink = async (req, res) => {
  try {
    const { plan, monto, payer_email } = req.body;

    const origin = req.headers.origin || req.headers.referer || process.env.FRONTEND_URL || 'http://localhost:4200';
    const baseUrl = origin.replace(/\/+$/, '');
    const email = payer_email || 'test_user_123456@testuser.com';

    const body = {
      reason: `Suscripción SmartMargin - ${plan}`,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: monto,
        currency_id: "ARS",
      },
      back_url: `${baseUrl}/mp/retorno`,
      payer_email: email,
    };

    const response = await axios.post(
      "https://api.mercadopago.com/preapproval",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    res.status(200).json({
      init_point: response.data.init_point,
      id: response.data.id,
      status: response.data.status,
    });
  } catch (error) {
    console.log("Error MP subscription:", error.response?.data || error.message);
    res.status(500).json({
      error: true,
      msg: "Failed to create subscription",
      detail: error.response?.data || error.message,
    });
  }
};

mpCtrl.getPaymentLink = async (req, res) => {
  try {
    const { payer_email, title, description, quantity, unit_price } = req.body;

    const origin = req.headers.origin || req.headers.referer || process.env.FRONTEND_URL || 'http://localhost:4200';
    const baseUrl = origin.replace(/\/+$/, '');

    const body = {
      payer_email: payer_email,
      items: [
        {
          title: title,
          description: description,
          quantity: quantity || 1,
          unit_price: unit_price,
        },
      ],
      back_urls: {
        failure: `${baseUrl}/mp/retorno`,
        pending: `${baseUrl}/mp/retorno`,
        success: `${baseUrl}/mp/retorno`,
      },
    };

    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    res.status(200).json({
      init_point: response.data.init_point,
      id: response.data.id,
    });
  } catch (error) {
    console.log("Error MP payment:", error.response?.data || error.message);
    res.status(500).json({
      error: true,
      msg: "Failed to create payment",
      detail: error.response?.data || error.message,
    });
  }
};

module.exports = mpCtrl;
