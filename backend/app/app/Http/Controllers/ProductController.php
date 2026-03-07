<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{

   
    public function index()
    {
        return Product::all();
    }

    
    public function store(Request $request)
    {
        $product = Product::create($request->all());

        return response()->json($product, 201);
    }

   
    public function show($id)
    {
        return Product::findOrFail($id);
    }

   
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $product->update($request->all());

        return response()->json($product);
    }


    public function destroy($id)
    {
        Product::destroy($id);

        return response()->json(null, 204);
    }

    public function buy(Request $request)
    {
    
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
         ]);

    $product = \App\Models\Product::find($request->product_id);

    
    if ($product->stock < $request->quantity) {
        return response()->json([
            'message' => 'Stock insuficiente para realizar la compra'
        ], 400);
    }

   
    $product->stock -= $request->quantity;
    $product->save();

   
    return response()->json([
        'message' => 'Compra realizada con éxito',
        'product' => $product
    ]);
    }
}