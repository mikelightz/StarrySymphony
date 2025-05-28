import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Offerings from "@/pages/Offerings";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import MoonMasterclass from "@/pages/MoonMasterclass";
import Contact from "@/pages/Contact";
//import NatalChart from "@/pages/NatalChart";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/offerings" component={Offerings} />
          <Route path="/shop" component={Shop} />
          <Route path="/cart" component={Cart} />
          <Route path="/moon-masterclass" component={MoonMasterclass} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </TooltipProvider>
  );
}

export default App;
