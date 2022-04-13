import React from 'react'

const SparkleInstance = ({ color, size, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 160 160"
      style={{ position: 'absolute', pointerEvents: 'none', zIndex: 2 }}
    >
      <path
        fill="#FFC700"
        d="M80 0s4.285 41.292 21.496 58.504C118.707 75.715 160 80 160 80s-41.293 4.285-58.504 21.496S80 160 80 160s-4.285-41.293-21.496-58.504C41.292 84.285 0 80 0 80s41.292-4.285 58.504-21.496C75.715 41.292 80 0 80 0z"
      ></path>
    </svg>
  );
}
// const Svg = styled.svg`
//   position: absolute;
//   pointer-events: none;
//   z-index: 2;
// `;
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutId = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    let isEnabled =
      typeof minDelay === 'number' && typeof maxDelay === 'number';
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = React.useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};

const DEFAULT_COLOR = 'hsl(50deg, 100%, 50%)';
const generateSparkle = (color = DEFAULT_COLOR) => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    // Bright yellow color:
    color,
    size: random(10, 20),
    style: {
      // Pick a random spot in the available space
      top: random(0, 100) + '%',
      left: random(0, 100) + '%',
      // Float sparkles above sibling content
      zIndex: 2,
    },
  }
}

function Sparkles({ children }) {
  // const sparkle = generateSparkle();
  const [sparkles, setSparkles] = React.useState([]);

  useRandomInterval(() => {
    const now = Date.now();

    const sparkle = generateSparkle();

    const nextSparkles = sparkles.filter(sparkle => {
      const delta = now - sparkle.createdAt;
      return delta < 1000;
    })

    nextSparkles.push(sparkle);
    setSparkles(nextSparkles)
  })

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {sparkles.map((sparkle, index) => (
        <SparkleInstance
          key={{ index }}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <div style={{ position: " relative", zIndex: 1, fontWeight: 'bold' }}>
        {children}
      </div>
    </div>
    // <Wrapper>
    //   {/* <SparkleInstance
    //     color={sparkle.color}
    //     size={sparkle.size}
    //     style={sparkle.style}
    //   />
    //   <ChildWrapper> */}
    //   {children}
    //   {/* </ChildWrapper> */}
    // </Wrapper>
  )
}


// const Wrapper = styled.span`
//   position: relative;
//   display: inline-block;
// `;

// const ChildWrapper = styled.strong`
//   position: relative;
//   z-index: 1;
//   font-weight: bold;
// `;

export default Sparkles;