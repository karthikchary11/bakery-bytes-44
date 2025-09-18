// PhonePe SDK Integration
// Note: This requires PhonePe SDK to be loaded first

// Import PhonePe SDK modules
require("node_modules/phonepesdk-web/index.js");
require("node_modules/phonepesdk-web/package.json");
require("node_modules/phonepesdk-web/phonepesdk.js");

// Enable PhonePe logging
PhonePe.PhonePe.loggingEnabled = true;

// Initialize PhonePe SDK
async function initializePhonePe() {
    try {
        let sdk = await PhonePe.PhonePe.build(PhonePe.Constants.Species.web);
        
        // Fetch auth token
        PhonePe.PhonePe.build(PhonePe.Constants.Species.web).then((sdk) => {
            sdk.fetchAuthToken().then((res) => {
                console.log("Grant token data received = " + res);
                alert(res);
            }).catch((err) => {
                console.log("Error occurred while fetching the grant token: " + err);
                alert(err);
            });
        });

        // Check if method is supported before using
        if (sdk.isMethodSupported('setItem')) {
            sdk.setItem('app', 'key', 'value');
        }
        
    } catch (error) {
        console.error('PhonePe initialization failed:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePhonePe);