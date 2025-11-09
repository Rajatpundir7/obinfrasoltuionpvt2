// Vercel Serverless Function for Contact Form
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get form data
    const { name, email, message, phone, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, and Message).'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address.'
      });
    }

    // Sanitize input
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim();
    const sanitizedPhone = phone ? phone.trim() : '';
    const sanitizedSubject = subject ? subject.trim() : 'Contact Form Submission';
    const sanitizedMessage = message.trim();

    // Log the submission (for now - you can add email service later)
    console.log('Contact form submission:', {
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      timestamp: new Date().toISOString()
    });

    // For now, we'll return success
    // You can integrate email service (Resend, SendGrid) later
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! We have received your submission and will contact you shortly at ' + sanitizedEmail + '.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again or contact us directly at ombalaji.ltd@gmail.com'
    });
  }
};
