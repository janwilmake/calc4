export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static HTML
    if (path === "/" || path === "/index.html") {
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Calculator API endpoints
    const matches = path.match(/\/(add|subtract|multiply|divide)\/(-?\d+\.?\d*)\/(-?\d+\.?\d*)/);
    if (!matches) {
      return new Response("Invalid path", { status: 400 });
    }

    const [, operation, xStr, yStr] = matches;
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);

    let result: number;
    switch (operation) {
      case "add":
        result = x + y;
        break;
      case "subtract":
        result = x - y;
        break;
      case "multiply":
        result = x * y;
        break;
      case "divide":
        if (y === 0) {
          return new Response("Division by zero", { status: 400 });
        }
        result = x / y;
        break;
      default:
        return new Response("Invalid operation", { status: 400 });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator API</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 class="text-2xl font-bold mb-6 text-center">Calculator API</h1>
        
        <div class="space-y-4">
            <div class="flex space-x-4">
                <input type="number" id="x" placeholder="First number" 
                    class="flex-1 p-2 border rounded">
                <input type="number" id="y" placeholder="Second number" 
                    class="flex-1 p-2 border rounded">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <button onclick="calculate('add')" 
                    class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add</button>
                <button onclick="calculate('subtract')" 
                    class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Subtract</button>
                <button onclick="calculate('multiply')" 
                    class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Multiply</button>
                <button onclick="calculate('divide')" 
                    class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Divide</button>
            </div>
            
            <div id="result" class="mt-4 p-4 bg-gray-100 rounded text-center"></div>
        </div>
    </div>

    <script>
        async function calculate(operation) {
            const x = document.getElementById('x').value;
            const y = document.getElementById('y').value;
            
            if (!x || !y) {
                document.getElementById('result').textContent = 'Please enter both numbers';
                return;
            }

            try {
                const response = await fetch(\`/\${operation}/\${x}/\${y}\`);
                const data = await response.json();
                document.getElementById('result').textContent = \`Result: \${data.result}\`;
            } catch (error) {
                document.getElementById('result').textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;