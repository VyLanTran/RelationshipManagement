import React, { useEffect, useRef } from 'react';

const Graph = () => {

    const graphRef = React.useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'bundle.js';
        script.async = true;

        const currentRef = graphRef.current;

        if (currentRef) {
            currentRef.appendChild(script);
            console.log("Script has already been run")
        }
        
        return () => {
            if (currentRef) {
                console.log("Cleanup Operation")
                currentRef.removeChild(script);
            }
        };
    }, []);

    return (
        <div className='w-[20vh] h-[20vh] overflow-hidden'>
            <div className='' ref={graphRef}/>
        </div>
    )
}

export default Graph
