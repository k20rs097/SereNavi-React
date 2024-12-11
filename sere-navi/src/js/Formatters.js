class Formatters {
  static printArgs = (functionName, args) => {
    console.log(`Function: ${functionName}`);
    args.forEach((arg, index) => {
      console.log(index, arg);
    });
  };

  static getFormattedDistance = (
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    distance
  ) => {
    if (distance) {
      if (distance >= 1) {
        return `${Math.round(distance * 10) / 10} km`;
      } else {
        return `${Math.round(distance * 1000)} m`;
      }
    }

    if (startLatitude && startLongitude && endLatitude && endLongitude) {
      distance = this.getHaversineDistance(
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude
      );
      if (distance >= 1) {
        return `${Math.round(distance * 10) / 10} km`;
      } else {
        return `${Math.round(distance * 1000)} m`;
      }
    }

    return "-- m";
  };

  static getHaversineDistance = (
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude
  ) => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (endLatitude - startLatitude) * (Math.PI / 180);
    const dLon = (endLongitude - startLongitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(startLatitude * (Math.PI / 180)) *
        Math.cos(endLatitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 距離 (km)
  };

  static getProcessedDisplayName = (displayName) => {
    if (!displayName) {
      console.error("Invalid display name:", displayName);
      return [];
    }
    let splitNames = displayName.split(", ");
    // 最初の地名と最後の国名を削除
    splitNames.shift();
    splitNames.pop();

    const postCode = splitNames.length > 0 ? splitNames.pop() : "";
    const prefecture = splitNames.length > 0 ? splitNames.pop() : "";
    const city = splitNames.length > 0 ? splitNames.pop() : "";
    let district = ""; // 最初に空文字で初期化
    if (splitNames.length > 0) {
      district = splitNames.pop();
    }

    // prefecture, city, district を結合して一つの文字列として扱う
    const addressArray = [prefecture + city + district];

    // 残りのsplitNamesを逆順にして文字列に結合
    const remainingNames = splitNames.reverse().join(", ");

    return [postCode, addressArray, remainingNames];
  };

  static getProcessedNameByType = (result) => {
    if (result.type === "station") {
      return `${result.name}駅`;
    } else if (result.type === "bus_stop") {
      return `${result.name}駅（バス停）`;
    }
    return result.name;
  };

  static getJapaneseDirection = (modifier) => {
    switch (modifier) {
      case "uturn":
        return "Uターン";
      case "right":
      case "slight right":
        return "右方向";
      case "left":
      case "slight left":
        return "左方向";
      case "sharp right":
        return "大きく右方向";
      case "sharp left":
        return "大きく左方向";
      case "straight":
        return "直進";
      case "arrive":
        return "到着";
      default:
        return modifier;
    }
  };

  static getIndicatorDistance = (distance) => {
    switch (distance) {
      case distance < 10:
        return Math.round(distance);
      case distance < 50:
        return Math.round(distance / 10) * 10;
      case distance < 100:
        return Math.round(distance / 50) * 50;
      default:
        return Math.round(distance / 100) * 100;
    }
  };

  static getInstructionText = (data) => {
    if (!data.routes || !data.routes[0].legs[0].steps) {
      console.error("Invalid route data:", data);
      return [];
    }

    const route = data.routes[0];
    const steps = route.legs[0].steps;
    // const totalDistance = data.routes[0].distance;
    // console.log(`data.routes[0].distance: ${totalDistance}`);
    let instructions = [];

    steps.forEach((step) => {
      let instructionText = "";
      let distance = this.getIndicatorDistance(step.distance);
      let modifier = step.maneuver.modifier;
      let japaneseModifier = this.getJapaneseDirection(step.maneuver.modifier);
      // console.log(`step.maneuver.modifier: ${step.maneuver.modifier}`);

      switch (step.maneuver.type) {
        case "depart":
          instructionText = `${
            step.name ? step.name + "を" : ""
          }出発`;
          break;
        case "turn":
          instructionText = `${
            step.name ? step.name + "で" : ""
          }${japaneseModifier}`;
          break;
        case "end of road":
          instructionText = `突き当たりで${japaneseModifier}`;
          break;
        case "arrive":
          instructionText = "到着";
          break;
        default:
          instructionText = `${
            step.name ? step.name + "を" : ""
          }${japaneseModifier}`;
      }

      instructions.push({
        text: instructionText,
        modifier: modifier ? modifier : "depart",
        distance: distance,
      });
    });

    if (instructions.length > 0) {
      instructions[instructions.length - 1].modifier = "arrive";
    }

    return instructions;
  };

  static getFormattedTime = (time) => {
    if (!time) {
      return "--時間--分";
    }
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time % 60);
    return `${hours}時間${minutes}分`;
  };
}

export default Formatters;
