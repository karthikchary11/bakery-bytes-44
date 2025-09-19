import emailjs from "emailjs-com";

// EmailJS configuration for Admin
const ADMIN_SERVICE_ID = "service_4q5syxi";
const ADMIN_TEMPLATE_ID = "template_93gnvid";
const ADMIN_PUBLIC_KEY = "w7QWhH3-Gm33efv-P";

// EmailJS configuration for User  
const USER_SERVICE_ID = "service_z0dp8it";
const USER_TEMPLATE_ID = "template_fjlsceg";
const USER_PUBLIC_KEY = "-V6-27i5YMWMWu-lF";

// Initialize EmailJS with admin key by default
emailjs.init(ADMIN_PUBLIC_KEY);

export const sendEmail = (formData) => {
  return emailjs.send(ADMIN_SERVICE_ID, ADMIN_TEMPLATE_ID, formData, ADMIN_PUBLIC_KEY);
};

// Email templates for different scenarios
export const sendRegistrationNotification = (userData) => {
  const emailData = {
    to_name: "Admin",
    to_email: "divyakanneti3@gmail.com",
    from_name: "Karachi Bakery System",
    subject: "New Franchise Registration - Approval Required",
    message: `A new franchise owner has registered and requires approval:
    
Name: ${userData.name}
Email: ${userData.email}
Location: ${userData.location}
Phone: ${userData.phone}

Please login to the admin dashboard to approve or reject this registration.`,
    user_name: userData.name,
    user_email: userData.email,
    user_location: userData.location,
    user_phone: userData.phone
  };
  
  return sendEmail(emailData);
};

export const sendApprovalNotification = (userData, isApproved) => {
  const status = isApproved ? "approved" : "rejected";
  const emailData = {
    to_name: userData.name,
    to_email: userData.email,
    from_name: "Karachi Bakery",
    subject: `Franchise Registration ${isApproved ? 'Approved' : 'Rejected'}`,
    message: `Dear ${userData.name},

Your franchise registration has been ${status}.

${isApproved ? 
  'Welcome to the Karachi Bakery family! You can now login to access your dashboard and start managing your franchise orders.' : 
  'Unfortunately, your application does not meet our current requirements. Please contact us for more information.'}

Location: ${userData.location}

Best regards,
Karachi Bakery Team`,
    user_name: userData.name,
    user_location: userData.location,
    approval_status: status
  };
  
  return sendEmail(emailData);
};

export const sendOrderNotification = async (orderData) => {
  // Parse cart items if it's a string
  let cartItems = [];
  if (typeof orderData.productName === 'string' && orderData.productName.includes('(x')) {
    // Parse format like "Chocolate Cake (x2), Biscuits (x1)"
    cartItems = orderData.productName.split(', ').map(item => {
      const match = item.match(/^(.+) \(x(\d+)\)$/);
      if (match) {
        return {
          name: match[1],
          units: parseInt(match[2]),
          price: Math.round(orderData.total / orderData.quantity) // Estimate price per item
        };
      }
      return {
        name: item,
        units: 1,
        price: orderData.total
      };
    });
  } else {
    cartItems = [{
      name: orderData.productName,
      units: orderData.quantity,
      price: orderData.total
    }];
  }

  const orderId = `ORD${Date.now()}`;
  
  // Admin email parameters
  const adminParams = {
    order_id: orderId,
    email: "divyakanneti3@gmail.com",
    orders: cartItems,
    cost: {
      shipping: 0,
      tax: 0,
      total: orderData.total
    }
  };

  // User email parameters  
  const userParams = {
    order_id: orderId,
    email: "divyakanneti7@gmail.com",
    orders: cartItems,
    cost: {
      shipping: 0,
      tax: 0,
      total: orderData.total
    }
  };

  try {
    // Send email to Admin
    await emailjs.send(
      ADMIN_SERVICE_ID,
      ADMIN_TEMPLATE_ID,
      adminParams,
      ADMIN_PUBLIC_KEY
    );
    console.log("✅ Admin email sent");

    // Send email to User
    await emailjs.send(
      USER_SERVICE_ID,
      USER_TEMPLATE_ID,
      userParams,
      USER_PUBLIC_KEY
    );
    console.log("✅ User email sent");

    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export const sendLoginAlert = (userData) => {
  const emailData = {
    to_name: "Admin",
    to_email: "divyakanneti3@gmail.com",
    from_name: "Karachi Bakery System",
    subject: "User Login Alert",
    message: `User login detected:
    
Name: ${userData.name}
Email: ${userData.email}
Role: ${userData.role}
Login Time: ${new Date().toLocaleString()}
Location: ${userData.location || 'N/A'}`,
    user_name: userData.name,
    user_email: userData.email,
    user_role: userData.role,
    login_time: new Date().toLocaleString()
  };
  
  return sendEmail(emailData);
};