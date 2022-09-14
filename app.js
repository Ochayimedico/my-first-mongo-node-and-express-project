const bcrypt = require("bcrypt");

const hashedPassword = async (password) => {
  //   const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, 12);
  //   console.log(salt);
  console.log(hash);
};

const login = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  if (result) {
    console.log("SUCCESSFULLY MATCHED. PASSWORD IS CORRECT");
  } else {
    console.log("FAILED MATCH. INPUT CORRECT PASSWORD");
  }
};
hashedPassword("medico");

// login("medico", "$2b&12$twJOOuvPwH58ZI9K8Joaneu/.GjUohmxObZDj9lNbO/TT0XRNzp9u");
