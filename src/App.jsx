import { useState } from "react";

function App() {
  const [polygons, setPolygons] = useState([]); // Stores completed polygons
  const [currentPolygon, setCurrentPolygon] = useState([]); // Tracks vertices of the current polygon

  const handleCanvasClick = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    // Add the clicked point to the current polygon
    setCurrentPolygon((prev) => [...prev, { x, y }]);
  };

  const handleFinishPolygon = () => {
    // Add the current polygon to the list as it is
    if (currentPolygon.length > 2) {
      setPolygons((prev) => [...prev, currentPolygon]);
      setCurrentPolygon([]); // Reset current polygon for a new drawing
    }
  };

  const handleDrag = (e, polygonIndex, vertexIndex) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    // Update the dragged vertex position
    setPolygons((prevPolygons) =>
      prevPolygons.map((polygon, pIndex) =>
        pIndex === polygonIndex
          ? polygon.map((vertex, vIndex) =>
            vIndex === vertexIndex ? { x, y } : vertex
          )
          : polygon
      )
    );
  };

  return (
    <div className="App">
      <button style={{
        backgroundColor: currentPolygon.length >= 3 ? '#4CAF50' : '#ccc',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        ':active': {
          backgroundColor: 'red',
          transform: 'scale(0.9)'
        },
        ':hover': {
          backgroundColor: currentPolygon.length >= 3 ? '#3e8e41' : '#ccc'
        }
      }} onClick={handleFinishPolygon} disabled={currentPolygon.length < 3}>
        Finish Polygon
      </button>

      <svg
        className="drawing-area"
        width="100vw"
        height="100vh"
        onClick={handleCanvasClick}
      >
        {/* Render completed polygons */}
        {polygons.map((polygon, polygonIndex) => (
          <g key={polygonIndex}>
            <polygon
              points={polygon.map(({ x, y }) => `${x},${y}`).join(" ")}
              fill="rgba(0, 150, 255, 0.4)"
              stroke="blue"
              strokeWidth="2"
            />
            {polygon.map((vertex, vertexIndex) => (
              <circle
                key={vertexIndex}
                cx={vertex.x}
                cy={vertex.y}
                r={5}
                fill="red"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const onMouseMove = (event) => handleDrag(event, polygonIndex, vertexIndex);
                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };
                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
              />
            ))}
          </g>
        ))}

        {/* Render current polygon */}
        {currentPolygon.length > 0 && (
          <g>
            <polygon
              points={currentPolygon.map(({ x, y }) => `${x},${y}`).join(" ")}
              fill="rgba(0, 150, 255, 0.2)"
              stroke="blue"
              strokeWidth="1"
            />
            {currentPolygon.map((vertex, index) => (
              <circle key={index} cx={vertex.x} cy={vertex.y} r={5} fill="red" />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export default App;
