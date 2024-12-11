import React, { useState, useCallback, useMemo } from "react";
import {
  BsSignTurnRight,
  BsSignTurnLeft,
  BsSignTurnSlightRight,
  BsSignTurnSlightLeft,
} from "react-icons/bs";
import { TbArrowSharpTurnRight, TbArrowSharpTurnLeft } from "react-icons/tb";
import { HiMiniArrowUturnDown, HiMiniArrowUp } from "react-icons/hi2";
import { BiErrorCircle } from "react-icons/bi";
import { LuGoal } from "react-icons/lu";
import "../../scss/InstructionView.scss";

const InstructionView = ({ instructions }) => {
  const audioFiles = useMemo(() => ({
    uturn: "/audio/uturn.wav",
    right: "/audio/right.wav",
    "sharp right": "/audio/right.wav",
    "slight right": "/audio/right.wav",
    left: "/audio/left.wav",
    "sharp left": "/audio/left.wav",
    "slight left": "/audio/left.wav",
    arrive: "/audio/arrive.wav",
    default: "/audio/startGuidance.wav",
  }), []);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio =  useCallback((modifier) => {
    if (isPlaying) return;
    const audioFile = audioFiles[modifier] || audioFiles.default;
    const audio = new Audio(audioFile); // 公開ディレクトリの適切なパスに配置

    setIsPlaying(true);

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    });
  }, [audioFiles, isPlaying]);

  const renderIndicatorIcon = (modifier) => {
    switch (modifier) {
      case "uturn":
        return <HiMiniArrowUturnDown />;
      case "right":
        return <BsSignTurnRight />;
      case "sharp right":
        return <TbArrowSharpTurnRight />;
      case "slight right":
        return <BsSignTurnSlightRight />;
      case "left":
        return <BsSignTurnLeft />;
      case "sharp left":
        return <TbArrowSharpTurnLeft />;
      case "slight left":
        return <BsSignTurnSlightLeft />;
      case "arrive":
        return <LuGoal />;
      case "straight":
        return <HiMiniArrowUp />
      default:
        return <BiErrorCircle />;
    }
  };

  const renderInstructionBar = (instructions) => (
    <div className="instruction-bar">
      {instructions ? (
        instructions.map((instruction, index) => (
          <div className="instruction-bar__child" key={index} onClick={() => {playAudio(instruction.modifier)}}>
            <div className="indicator-icon">
              {renderIndicatorIcon(instruction.modifier)}
            </div>
            <div className="indicator-text__parent">
              <div className="indicator-text__direction">
                {instruction.text}
              </div>
              <div className="indicator-text__distance">
                {instruction.modifier === "arrive"
                  ? ""
                  : `${instruction.distance}m先`}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="instruction-bar__child" key="0">
          <div className="indicator-icon">
            <BsSignTurnRight />
          </div>
          <div className="indicator-text__parent">
            <div className="indicator-text__direction"></div>
            <div className="indicator-text__distance">-- m先</div>
          </div>
        </div>
      )}
    </div>
  );

  return <>{renderInstructionBar(instructions)}</>;
};

export default InstructionView;
