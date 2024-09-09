import {useState} from "react";

export default function weight({weightData = 0, repsData = 1, increment = 10}: {}) {
    console.log("renderWeight")
    const [reps, setReps] = useState(repsData);
    const [weight, setWeight] = useState(weightData);

    return (<div className="flex flex-col">

            <div className="relative flex items-center max-w-[11rem] min-w-[10rem]">
                <button type="button" id="decrement-button" onClick={() => {
                    const newWeight = weight - 1;
                    setWeight(newWeight);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M1 1h16"/>
                    </svg>
                </button>
                <input type="text" id="weight-input" data-input-counter data-input-counter-min="1"
                       data-input-counter-max="5" aria-describedby="helper-text-explanation"
                       className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="" value={weight} required/>
                <div
                    className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M22 19.4199H8C6.4087 19.4199 4.88254 18.7878 3.75732 17.6626C2.63211 16.5374 2 15.0112 2 13.4199V11.6699"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"></path>
                            <path d="M19 22.4199L22 19.4199L19 16.4199" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"></path>
                            <path
                                d="M2 5.41992H16C17.5913 5.41992 19.1174 6.05203 20.2426 7.17725C21.3678 8.30246 22 9.82862 22 11.4199V13.22"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"></path>
                            <path d="M5 2.41992L2 5.41992L5 8.41992" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                    </svg>
                    <span>Weight</span>
                </div>
                <button type="button" id="increment-button" onClick={() => {
                    const newWeight = weight + increment;
                    setWeight(newWeight);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 1v16M1 9h16"/>
                    </svg>
                </button>
            </div>
            <div className="relative flex items-center max-w-[11rem]">
                <button type="button" id="decrement-button" onClick={() => {
                    const newReps = reps - 1;
                    setReps(newReps);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M1 1h16"/>
                    </svg>
                </button>
                <input type="text" id="reps-input" data-input-counter min="1"
                       aria-describedby="helper-text-explanation"
                       className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="" value={reps} required/>
                <div
                    className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">

                    <svg className="w-2.5 h-2.5 text-gray-400" width="800px" height="800px" viewBox="0 0 24 24"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.1797 18C19.5797 18 20.1797 16.65 20.1797 15V9C20.1797 7.35 19.5797 6 17.1797 6C14.7797 6 14.1797 7.35 14.1797 9V15C14.1797 16.65 14.7797 18 17.1797 18Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path
                            d="M6.82031 18C4.42031 18 3.82031 16.65 3.82031 15V9C3.82031 7.35 4.42031 6 6.82031 6C9.22031 6 9.82031 7.35 9.82031 9V15C9.82031 16.65 9.22031 18 6.82031 18Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path opacity="0.4" d="M9.82031 12H14.1803" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                        <path opacity="0.4" d="M22.5 14.5V9.5" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path opacity="0.4" d="M1.5 14.5V9.5" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                    <span>Reps</span>
                </div>
                <button type="button" id="increment-button" onClick={() => {
                    const newReps = reps + 1;
                    setReps(newReps);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 1v16M1 9h16"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};
