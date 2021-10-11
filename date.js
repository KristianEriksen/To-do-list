
exports.getDate = function() {
  
  let today = new Date();

  let option = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  
  return today.toLocaleDateString("en-US", option);
};

