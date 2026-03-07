<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{

    // LISTAR PRODUCTOS
    public function index()
    {
        return Product::all();
    }

    // CREAR PRODUCTO
    public function store(Request $request)
    {
        $product = Product::create($request->all());

        return response()->json($product, 201);
    }

    // MOSTRAR UN PRODUCTO
    public function show($id)
    {
        return Product::findOrFail($id);
    }

    // ACTUALIZAR PRODUCTO
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $product->update($request->all());

        return response()->json($product);
    }

    // ELIMINAR PRODUCTO
    public function destroy($id)
    {
        Product::destroy($id);

        return response()->json(null, 204);
    }

    public function buy(Request $request)
    {
    // 1. Validar que enviaron el ID del producto y la cantidad
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
         ]);

    $product = \App\Models\Product::find($request->product_id);

    // 2. Regla: No se puede comprar si el stock es insuficiente 
    if ($product->stock < $request->quantity) {
        return response()->json([
            'message' => 'Stock insuficiente para realizar la compra'
        ], 400);
    }

    // 3. Descontar el inventario 
    $product->stock -= $request->quantity;
    $product->save();

    // 4. Retornar respuesta de éxito [cite: 123]
    return response()->json([
        'message' => 'Compra realizada con éxito',
        'product' => $product
    ]);
    }
}