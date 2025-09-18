import emailjs from "emailjs-com";

// EmailJS configuration
const SERVICE_ID = "service_4q5syxi";
const TEMPLATE_ID = "template_kfdwcjt";
const PUBLIC_KEY = "w7QWhH3-Gm33efv-P";

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export const sendEmail = (formData) => {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);
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

export const sendOrderNotification = (orderData) => {
  const emailData = {
    to_name: "Admin",
    to_email: "divyakanneti3@gmail.com",
    from_name: "Karachi Bakery System",
    subject: "New Order Placed",
    message: `A new order has been placed:
    
Product: ${orderData.productName}
Quantity: ${orderData.quantity}
Total Amount: ₹${orderData.total}
Franchise Location: ${orderData.franchiseLocation}
Customer: ${orderData.customerName}

Please process this order at your earliest convenience.`,
    product_name: orderData.productName,
    quantity: orderData.quantity,
    total: orderData.total,
    franchise_location: orderData.franchiseLocation,
    customer_name: orderData.customerName
  };
  
  return sendEmail(emailData);
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