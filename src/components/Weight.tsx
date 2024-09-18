export default function weight({weightData = 0, repsData = 1, increment = 10, edit}: {}) {
    console.log("renderWeight")

    function deleteWeights(e: React.MouseEvent<HTMLDivElement>) {

    }

    return (<div className="flex flex-col p-2">
            {edit ? <div onClick={(e) => deleteWeights(e)}
                         className="text-gray-700 border border-gray-700 font-medium rounded-lg text-lg p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                <svg className="w-10 h-6 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"></path>
                    <path
                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"></path>
                </svg>
                Edit Set
            </div> : null}
            <div className="relative flex items-center max-w-[11rem] min-w-[10rem]">
                <button type="button" id="decrement-button" onClick={() => {
                    const newWeight = weightData - 1;
                    //setWeightData(newWeight);
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
                       placeholder="" value={weightData} required/>
                <div
                    className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <span>Weight</span>
                </div>
                <button type="button" id="increment-button" onClick={() => {
                    const newWeight = weightData + increment;
                    //setWeightData(newWeight);
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
                    const newReps = repsData - 1;
                    //setRepsData(newReps);
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
                       placeholder="" value={repsData} required/>
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
                    const newReps = repsData + 1;
                    //setRepsData(newReps);
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
