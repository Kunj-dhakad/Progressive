import React, { useEffect, useRef, useState } from "react";
import {
  updateClip,
  //   deleteClip,
  Allclips,
  //   addClip,

} from "../../../../app/store/clipsSlice";


import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store/store";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAngleUp,
  FaAngleDown
} from 'react-icons/fa';
type FloatingToolbarProps = {
  Allclip: Allclips;
};

export const EmojiFT: React.FC<FloatingToolbarProps> = ({ Allclip }) => {
  const dispatch = useDispatch();
  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  console.log("FloatingToolbar Allclips:", Allclips);

  const Activeid = useSelector(
    (state: RootState) => state.editorTool.Activeid
  );



  type TextAlign = "left" | "center" | "right" | "justify";





  const [fontSize, setFontSize] = useState(30);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [textColor, setTextColor] = useState("");
  const [textDecorationLine, setTextDecorationLine] = useState("none");
  const [fontstyle, setFontstyle] = useState('normal');


  useEffect(() => {
    const activeText = Allclips.find((clip) => clip.id === Activeid);
    // console.log(activeClip?.properties);
    if (activeText?.type === "text") {

      setFontSize(activeText.properties.fontSize);
      setFontWeight(activeText.properties.fontWeight);
      setTextColor(activeText.properties.textColor);
      setTextDecorationLine(activeText.properties.textDecorationLine || "none");
      setFontstyle(activeText.properties.fontstyle)

    }
  }, [Activeid, Allclips]);


  const value_update = (updatedProperties: Partial<any>) => {
    dispatch(
      updateClip({
        id: Activeid,
        properties: {
          fontSize,
          fontWeight,
          textAlign,
          textColor,
          textDecorationLine,
          fontstyle,
          ...updatedProperties,
        },
      })
    );
  };







  const ItalicFontStyle = () => {
    const newFontStyle = fontstyle === "Italic" ? "Normal" : "Italic";
    setFontstyle(newFontStyle);
    value_update({ fontstyle: newFontStyle });
  };

  const toggleFontWeight = (newWeight: string) => {
    const updatedWeight = fontWeight === newWeight ? "normal" : newWeight;
    setFontWeight(updatedWeight);
    value_update({ fontWeight: updatedWeight });
  };

  const toggleTextDecorationLine = (newDecorationLine: string) => {
    const DecorationLine = textDecorationLine === newDecorationLine ? "none" : newDecorationLine;
    setTextDecorationLine(DecorationLine);
    value_update({ textDecorationLine: DecorationLine });
  };



  // const dispatch = useDispatch();

  const [setupPopup, setSetupPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setSetupPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef, buttonRef]);



  return (

    <div className="flex items-center gap-4 bg-white border shadow-lg p-3 rounded-2xl  transform -translate-x-1/2">

      {/* 🎨 Color Picker with Icon */}
      <div className="flex items-center gap-1">
        {/* <input
          type="color"
          className="w-20 h-20 rounded cursor-pointer border"
        /> */}
        <input
          type="color"
          className="w-20 h-20 rounded cursor-pointer border"
          value={textColor}
          onChange={(e) => {
            setTextColor(e.target.value);
            value_update({ textColor: e.target.value });
          }}
        />
      </div>

      {/* 🔤 Bold, Italic, Underline */}
      <button  onClick={() => toggleFontWeight("bold")} className="p-5 hover:bg-gray-100 rounded" title="Bold">
        <FaBold fontSize={60} />
      </button>
      <button onClick={ItalicFontStyle} className="p-2 hover:bg-gray-100 rounded" title="Italic">
        <FaItalic fontSize={60} />
      </button>
      <button  onClick={() => toggleTextDecorationLine('underline')} className="p-2 hover:bg-gray-100 rounded" title="Underline">
        <FaUnderline fontSize={60} />
      </button>

      {/* 📐 Text Alignment */}
      <button onClick={(e) => {
        setTextAlign("left" as TextAlign);
        value_update({ textAlign: "left" });
      }} className="p-2 hover:bg-gray-100 rounded" title="Align Left">
        <FaAlignLeft fontSize={60} />
      </button>

      <button
        onClick={(e) => {
          setTextAlign("center" as TextAlign);
          value_update({ textAlign: "center" });
        }} className="p-2 hover:bg-gray-100 rounded" title="Align Center">
        <FaAlignCenter fontSize={60} />
      </button>
      <button
        onClick={(e) => {
          setTextAlign("right" as TextAlign);
          value_update({ textAlign: "right" });
        }}
        className="p-2 hover:bg-gray-100 rounded" title="Align Right">
        <FaAlignRight fontSize={60} />
      </button>


      {/* 🔽 Font Size Dropdown */}
      <div className="relative" ref={buttonRef}>
        <button
          onClick={() => setSetupPopup((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-100"
        >
          <span className="text-6xl font-bold text-black">{fontSize}</span>
          {setupPopup ? <FaAngleUp fontSize={60} /> : <FaAngleDown fontSize={60} />}
        </button>

        {setupPopup && (
          <div
            ref={popupRef}
            className="absolute mt-2 w-30 bg-white border rounded-lg shadow-lg z-50 max-h-90 overflow-y-auto"
          >
            {[20, 30, 40, 50, 60, 70, 80, 90, 100,120,140,160,180,200,250].map((size) => (
              <div
                key={size}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center text-6xl"
                onClick={() => {
                  setFontSize(size);
                  value_update({ fontSize: size });
                  setSetupPopup(false);
                }}
              >
                {size}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
