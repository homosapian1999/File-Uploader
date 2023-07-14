export const simulatedFileUpload = (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Demo simulated response
      const simulatedResponse = {
        path: "uploads/demoPath.js",
        status: "success",
      };

      resolve(simulatedResponse);
    }, 2000);
  });
};
