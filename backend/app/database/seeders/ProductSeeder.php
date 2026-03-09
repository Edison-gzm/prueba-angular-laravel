<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Productos dummy para probar la aplicación.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop HP 15', 'Category' => 'Electrónica', 'price' => 899.99, 'stock' => 12],
            ['name' => 'Mouse inalámbrico', 'Category' => 'Electrónica', 'price' => 24.50, 'stock' => 45],
            ['name' => 'Teclado mecánico', 'Category' => 'Electrónica', 'price' => 89.00, 'stock' => 20],
            ['name' => 'Monitor 24" Full HD', 'Category' => 'Electrónica', 'price' => 179.99, 'stock' => 8],
            ['name' => 'Webcam HD', 'Category' => 'Electrónica', 'price' => 49.99, 'stock' => 30],
            ['name' => 'Silla ergonómica', 'Category' => 'Mobiliario', 'price' => 249.00, 'stock' => 15],
            ['name' => 'Escritorio compacto', 'Category' => 'Mobiliario', 'price' => 159.00, 'stock' => 10],
            ['name' => 'Libreta A5', 'Category' => 'Papelería', 'price' => 3.50, 'stock' => 200],
            ['name' => 'Bolígrafo pack x10', 'Category' => 'Papelería', 'price' => 5.99, 'stock' => 150],
            ['name' => 'Auriculares con micrófono', 'Category' => 'Electrónica', 'price' => 39.99, 'stock' => 25],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(
                ['name' => $data['name']],
                $data
            );
        }
    }
}
