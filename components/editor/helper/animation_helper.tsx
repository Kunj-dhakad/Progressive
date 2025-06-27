import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { updateClip } from "../../../app/store/clipsSlice";
import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp } from "react-icons/lu";

type AnimationType = "None" | "Fade" | "Zoom" | "Slide" | "Rotate";
interface AnimationState {
    type: AnimationType;
    duration: number;
    slideDistanceX?: number;
    slideDistanceY?: number;
    degrees?: number;
}

const AnimationHelper: React.FC = () => {
    const Activeid = useSelector((state: RootState) => state.editorTool.Activeid);
    const Allclips = useSelector((state: RootState) => state.slices.present.Allclips);
    const dispatch = useDispatch();

    const [animationTypeIn, setAnimationTypeIn] = useState<string>("");
    const [animationTypeOut, setAnimationTypeOut] = useState<string>("");
    const [animationIn, setAnimationIn] = useState<AnimationState>({
        type: "None",
        duration: 60,
        slideDistanceX: 0,
        slideDistanceY: 0,
        degrees: 0,
    });

    const [animationOut, setAnimationOut] = useState<AnimationState>({
        type: "None",
        duration: 60,
        slideDistanceX: 0,
        slideDistanceY: 0,
        degrees: 0,
    });

    const [InOutactiveTab, InOutsetActiveTab] = useState<"in" | "out">("in");

    useEffect(() => {
        const activeImage = Allclips.find((image) => image.id === Activeid);
        if (activeImage?.type === "image") {
            const { animation } = activeImage.properties;
            setAnimationIn({
                type: animation?.in?.type ?? "None",
                duration: animation?.in?.duration ?? 60,
                slideDistanceX: animation?.in?.slideDistanceX ?? 0,
                slideDistanceY: animation?.in?.slideDistanceY ?? 0,
                degrees: animation?.in?.degrees ?? 0,
            });
            setAnimationOut({
                type: animation?.out?.type ?? "None",
                duration: animation?.out?.duration ?? 60,
                slideDistanceX: animation?.out?.slideDistanceX ?? 0,
                slideDistanceY: animation?.out?.slideDistanceY ?? 0,
                degrees: animation?.in?.degrees ?? 0,
            });
        }
    }, [Activeid, Allclips]);

    const update_value = (updateproperties: Partial<any>) => {
        dispatch(
            updateClip({
                id: Activeid,
                properties: {
                    animation: { in: animationIn, out: animationOut },
                    ...updateproperties,
                },
            })
        );
    };

    const slideConfigs = {
        "Slide Left": { key: "slideDistanceX", label: "Slide Distance X (Left)", sign: -1 },
        "Slide Right": { key: "slideDistanceX", label: "Slide Distance X (Right)", sign: 1 },
        "Slide Top": { key: "slideDistanceY", label: "Slide Distance Y (Top)", sign: -1 },
        "Slide Bottom": { key: "slideDistanceY", label: "Slide Distance Y (Bottom)", sign: 1 },
    };

    const renderAnimationButton = (
        label: string,
        newType: string,
        icon?: React.ReactNode,
        target: "in" | "out" = "in"
    ) => {
        const isActive = target === "in" ? animationTypeIn === label : animationTypeOut === label;
        const currentAnim = target === "in" ? animationIn : animationOut;
        const setAnim = target === "in" ? setAnimationIn : setAnimationOut;
        const setType = target === "in" ? setAnimationTypeIn : setAnimationTypeOut;

        const slideData: Partial<AnimationState> = { type: newType as AnimationType };

        if (label.includes("Left")) {
            slideData.slideDistanceX = -100;
            slideData.slideDistanceY = 0;
        }
        if (label.includes("Right")) {
            slideData.slideDistanceX = 100;
            slideData.slideDistanceY = 0;
        }
        if (label.includes("Top")) {
            slideData.slideDistanceY = -100;
            slideData.slideDistanceX = 0;
        }
        if (label.includes("Bottom")) {
            slideData.slideDistanceY = 100;
            slideData.slideDistanceX = 0;
        }
        if (label === "Rotate") {
            slideData.degrees = 60;
        }
        return (
            <div
                className={`animation-btn ${isActive ? "animation-btn-active" : ""}`}
                onClick={() => {
                    const newAnim = { ...currentAnim, ...slideData };
                    setAnim(newAnim);
                    setType(label);
                    update_value({
                        animation: {
                            in: target === "in" ? newAnim : animationIn,
                            out: target === "out" ? newAnim : animationOut,
                        },
                        ...(target === "in" ? { animationTypeIn: label } : { animationTypeOut: label }),
                    });
                }}
            >
                <button>
                    {icon && <div className="text-2xl">{icon}</div>}
                    <div className="text-sm mt-1">{label}</div>
                </button>
            </div>
        );
    };

    const renderSlideControl = (type: keyof typeof slideConfigs, target: "in" | "out") => {
        const config = slideConfigs[type];
        const anim = target === "in" ? animationIn : animationOut;
        const setAnim = target === "in" ? setAnimationIn : setAnimationOut;

        const rawVal = anim[config.key as keyof AnimationState];
        const val = typeof rawVal === "number" ? rawVal : 0;

        return (
            <div>
                <label className="theme-small-text mt-2 w-8/12">{config.label}</label>
                <input
                    className="kd-range-input"
                    type="range"
                    min={0}
                    max={2000}
                    step={10}
                    value={Math.abs(val)}
                    onChange={(e) => {
                        const newVal = config.sign * parseInt(e.target.value);
                        const newAnim = {
                            ...anim,
                            [config.key]: newVal,
                            ...(config.key === "slideDistanceX" ? { slideDistanceY: 0 } : { slideDistanceX: 0 }),
                        };
                        setAnim(newAnim);
                        update_value({
                            animation: {
                                in: target === "in" ? newAnim : animationIn,
                                out: target === "out" ? newAnim : animationOut,
                            },
                        });
                    }}
                />
                <div className="theme-small-text">{Math.abs(val)}px</div>
            </div>
        );
    };

    return (
        <>
            <div className="kd-tab-list style-2">
                {[
                    { tab: "in", label: "IN" },
                    { tab: "out", label: "OUT" },
                ].map(({ tab, label }) => (
                    <button
                        key={tab}
                        onClick={() => InOutsetActiveTab(tab as "in" | "out")}
                        className={`kd-tab-btn ${InOutactiveTab === tab ? "active" : ""}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {InOutactiveTab === "in" && (
                <>
                    <div className="mb-4 space-y-2">
                        <label className="theme-small-text w-8/12">In Duration (ms)</label>
                        <input
                            className="kd-range-input"
                            type="range"
                            min={1}
                            max={300}
                            step={1}
                            value={animationIn.duration}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const newAnim = { ...animationIn, duration: val };
                                setAnimationIn(newAnim);
                                update_value({ animation: { in: newAnim, out: animationOut } });
                            }}
                        />

                        <div className="theme-small-text">{(animationIn.duration / 30).toFixed(2)}s</div>

                        {animationTypeIn === "Rotate" && (

                            <div>
                                <label className="theme-small-text w-8/12">degrees</label>
                                <input
                                    className="kd-range-input"
                                    type="range"
                                    min={-360}
                                    max={360}
                                    step={5}
                                    value={animationIn.degrees}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const newAnim = { ...animationIn, degrees: val };
                                        setAnimationIn(newAnim);
                                        update_value({ animation: { in: newAnim, out: animationOut } });
                                    }}
                                />

                                <div className="theme-small-text">{(animationIn.degrees)}&deg;</div>
                            </div>



                        )}
                        {["Slide Left", "Slide Right", "Slide Top", "Slide Bottom"].includes(animationTypeIn) &&
                            renderSlideControl(animationTypeIn as keyof typeof slideConfigs, "in")}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {renderAnimationButton("Slide Left", "Slide", <LuArrowLeft />, "in")}
                        {renderAnimationButton("Slide Right", "Slide", <LuArrowRight />, "in")}
                        {renderAnimationButton("Slide Top", "Slide", <LuArrowUp />, "in")}
                        {renderAnimationButton("Slide Bottom", "Slide", <LuArrowDown />, "in")}
                        {renderAnimationButton("Fade in", "Fade", undefined, "in")}
                        {renderAnimationButton("Zoom in", "Zoom", undefined, "in")}
                        {renderAnimationButton("Rotate", "Rotate", undefined, "in")}
                        {/* {renderAnimationButton("Zoom out", "Zoom", undefined, "in")} */}
                    </div>
                </>
            )}

            {InOutactiveTab === "out" && (
                <>
                    <div className="mb-4 space-y-2">
                        <label className="theme-small-text w-8/12">Out Duration (ms)</label>
                        <input
                            className="kd-range-input"
                            type="range"
                            min={1}
                            max={300}
                            step={1}
                            value={animationOut.duration}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const newAnim = { ...animationOut, duration: val };
                                setAnimationOut(newAnim);
                                update_value({ animation: { in: animationIn, out: newAnim } });
                            }}
                        />
                        <div className="theme-small-text">{(animationOut.duration / 30).toFixed(2)}s</div>
                        {["Slide Left", "Slide Right", "Slide Top", "Slide Bottom"].includes(animationTypeOut) &&
                            renderSlideControl(animationTypeOut as keyof typeof slideConfigs, "out")}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {renderAnimationButton("Slide Left", "Slide", <LuArrowLeft />, "out")}
                        {renderAnimationButton("Slide Right", "Slide", <LuArrowRight />, "out")}
                        {renderAnimationButton("Slide Top", "Slide", <LuArrowUp />, "out")}
                        {renderAnimationButton("Slide Bottom", "Slide", <LuArrowDown />, "out")}
                        {renderAnimationButton("Fade out", "Fade", undefined, "out")}
                        {/* {renderAnimationButton("Zoom in", "Zoom", undefined, "out")} */}
                        {renderAnimationButton("Zoom out", "Zoom", undefined, "out")}
                        {renderAnimationButton("Rotate", "Rotate", undefined, "out")}
                    </div>
                </>
            )}
        </>
    );
};

export default AnimationHelper;
