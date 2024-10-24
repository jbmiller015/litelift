import Weight_Icon from "../assets/icon/weight_icon";
import Reps_icon from "../assets/icon/reps_icon";
import {useEffect, useState} from "react";

enum StatusCode {
    complete = "complete",
    failed = "failed",
    none = "none"
}


export default function weight({weight = 0, reps = 1, status, updateData, index}, props) {
    const [statusCode, setStatusCode] = useState<string>(status);
    const [boxStyle, setBoxStyle] = useState('');
    useEffect(() => {
        if (boxStyle === '') {
            if (statusCode === StatusCode.complete) {
                setBoxStyle(completedStyleFlag);
            } else if (statusCode === StatusCode.failed) {
                setBoxStyle(failedStyleFlag)
            } else {
                setBoxStyle(noneStyleFlag);
            }
        }
    }, []);
    useEffect(() => {
        updateData(statusCode, index);
    }, [statusCode]);
    const completedStyleFlag = 'complete';
    const failedStyleFlag = 'fail';
    const noneStyleFlag = 'none';

    const setResult = () => {
        if (statusCode === StatusCode.none) {
            setBoxStyle(completedStyleFlag);
            setStatusCode(StatusCode.complete);
        } else if (statusCode === StatusCode.complete) {
            setBoxStyle(failedStyleFlag);
            setStatusCode(StatusCode.failed);
        } else if (statusCode === StatusCode.failed) {
            setBoxStyle(noneStyleFlag);
            setStatusCode(StatusCode.none);
        }
    }

    const getBoxStyle = () => {
        switch (boxStyle) {
            case completedStyleFlag:
                return "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
            case failedStyleFlag:
                return "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            case noneStyleFlag:
                return ""
        }
    }

    return (<div
            className={`flex flex-col items-center justify-items-center rounded-lg p-2 m-2 outline outline-2 outline-offset-2 max-w-[10rem] min-w-[10rem] ${getBoxStyle()}`}
            onClick={() => setResult()}>
            <div className="relative w-full flex items-stretch self-center">
                <Weight_Icon/>
                <h3 className="text-3xl absolute left-1/2 font-bold place-self-center">{weight}</h3>
            </div>
            <div className={`border-2 w-full ${getBoxStyle()}`}/>
            <div className="relative w-full flex items-center space-x-2 self-center">
                <Reps_icon/>
                <h3 className="text-3xl font-bold absolute left-1/2 ml-[40px]">{reps}</h3>
            </div>
        </div>
    );
};
