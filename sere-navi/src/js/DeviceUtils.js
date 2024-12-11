class DeviceUtils {
  static watchUserLocation = (
    setIsFollowingCurrentLocation,
    setCurrentPosition
  ) => {
    let watchId = null;
    if ("geolocation" in navigator) {
      console.log("Geolocation is available");
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          // console.log("Position obtained: ", position.coords);
          setIsFollowingCurrentLocation(true);
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current position: ");
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("Permission denied. Check browser settings.");
              alert(
                "位置情報の取得が許可されていません．\n設定で許可してください."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Position unavailable. Try again later.");
              alert("位置情報が利用できません．");
              break;
            case error.TIMEOUT:
              console.error("Request timed out.");
              break;
            default:
              console.error("Unknown error.", error);
              alert("位置情報の取得に失敗しました．");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 3000,
        }
      );
    } else {
      console.log("Geolocation is not available");
      alert("ブラウザが位置情報取得をサポートしていません。");
    }
  };
}

export default DeviceUtils;
