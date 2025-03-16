export const imageMapping = {
    "boy_avatar1.png": require("../assets/avatar/boy_avatar1.png"),
    "boy_avatar2.png": require("../assets/avatar/boy_avatar2.png"),
    "boy_avatar3.png": require("../assets/avatar/boy_avatar3.png"),
    "boy_avatar4.png": require("../assets/avatar/boy_avatar4.png"),
    "boy_avatar5.png": require("../assets/avatar/boy_avatar5.png"),
    "boy_avatar6.png": require("../assets/avatar/boy_avatar6.png"),
    "boy_avatar7.png": require("../assets/avatar/boy_avatar7.png"),
    "boy_avatar8.png": require("../assets/avatar/boy_avatar8.png"),
    "girl_avatar1.png": require("../assets/avatar/girl_avatar1.png"),
    "girl_avatar2.png": require("../assets/avatar/girl_avatar2.png"),
    "girl_avatar3.png": require("../assets/avatar/girl_avatar3.png"),
    "girl_avatar4.png": require("../assets/avatar/girl_avatar4.png"),
    "girl_avatar5.png": require("../assets/avatar/girl_avatar5.png"),
    "girl_avatar6.png": require("../assets/avatar/girl_avatar6.png"),
    "girl_avatar7.png": require("../assets/avatar/girl_avatar7.png"),
    "girl_avatar8.png": require("../assets/avatar/girl_avatar8.png"),
    "girl_avatar9.png": require("../assets/avatar/girl_avatar9.png"),
    "girl_avatar10.png": require("../assets/avatar/girl_avatar10.png"),
    "girl_avatar11.png": require("../assets/avatar/girl_avatar11.png"),
    "girl_avatar12.png": require("../assets/avatar/girl_avatar12.png"),
  };

// Function for the posts - to get the image  . 'boy_avatar1.png' is the default image
export const getAvatarImage = (imageName) => {
    return imageMapping[imageName] || require("../assets/avatar/boy_avatar1.png"); 
};  