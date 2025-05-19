import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, X, Trash } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { toast } = useToast();
  
  const { data: cart, isLoading } = useQuery({
    queryKey: ['/api/cart'],
  });
  
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => 
      apiRequest("DELETE", `/api/cart/remove/${itemId}`),
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Could not remove item. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleRemoveItem = (itemId: number) => {
    removeFromCartMutation.mutate(itemId);
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.h1 
          className="font-playfair text-4xl md:text-5xl text-center mb-8 text-deepblue"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Your Cart
        </motion.h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-terracotta rounded-full border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        ) : cart?.items?.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-6">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="font-medium text-terracotta">${(item.price * item.quantity).toFixed(2)}</div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition duration-200"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-lg font-medium">Total</div>
                <div className="text-xl font-bold text-terracotta">${cart.total.toFixed(2)}</div>
              </div>
              
              <div className="mt-8 space-y-4">
                <button className="w-full bg-olive hover:bg-opacity-90 text-white py-3 px-6 rounded-lg transition duration-300">
                  Proceed to Checkout
                </button>
                <Link href="/shop">
                  <a className="block w-full text-center py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300">
                    Continue Shopping
                  </a>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-playfair mb-4 text-deepblue">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/shop">
              <a className="bg-terracotta text-white px-6 py-3 rounded-lg inline-block hover:bg-opacity-90 transition duration-300">
                Browse Products
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}