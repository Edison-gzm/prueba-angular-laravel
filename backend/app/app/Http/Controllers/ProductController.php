<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Lista productos. Con per_page devuelve paginado (scroll infinito); sin params devuelve todos.
     *
     * @param Request $request Query: page (opcional), per_page (opcional; si no se envía = todos)
     * @return JsonResponse Array de productos, o { data, current_page, last_page, per_page, total }
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page');

        if ($perPage === null || $perPage === '') {
            return response()->json(Product::orderBy('id')->get(), 200);
        }

        $perPage = (int) $perPage;
        $perPage = max(1, min($perPage, 50));

        $paginator = Product::orderBy('id')->paginate($perPage);

        return response()->json([
            'data' => $paginator->items(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ], 200);
    }

    
   public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'Category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $product = Product::create($data);
        return response()->json($product, 201);
    }
   
   public function show($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        return response()->json($product, 200);
    }

   
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'string|max:255',
            'Category' => 'string',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0'
        ]);

        $product->update($data);
        return response()->json($product, 200);
    }

    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Producto eliminado'], 200);
    }


   public function buy(Request $request): JsonResponse
    {
        $request->validate([
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1'
        ]);

        $granTotal = 0;
        $detallesCompra = [];

        return \DB::transaction(function () use ($request, &$granTotal, &$detallesCompra) {

            foreach ($request->items as $item) {
                 $product = Product::find($item['product_id']);

                // Verificar stock de cada producto
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para: " . $product->name);
                }

                // Calcular subtotal de esta línea
                $subtotal = $item['quantity'] * $product->price;
                $granTotal += $subtotal;

                // Restar stock
                $product->decrement('stock', $item['quantity']);

                // Guardar info para el recibo final
                $detallesCompra[] = [
                    'producto' => $product->name,
                    'cantidad' => $item['quantity'],
                    'precio_unitario' => $product->price,
                    'subtotal' => $subtotal
                ];
            }

             return response()->json([
                'message' => 'Compra múltiple realizada con éxito',
                'items_comprados' => $detallesCompra,
                'gran_total' => $granTotal
                ], 200);

        }, 5);
    }
}