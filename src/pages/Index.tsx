import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { getCurrentUser } from '../utils/auth';

const Index = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Set page title
    document.title = "Karachi Bakery Application";
    
    // If user is logged in, redirect to their dashboard
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'user') {
        navigate('/user');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <Hero />
      <ProductCategories />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
