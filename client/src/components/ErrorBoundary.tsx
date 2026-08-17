import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      const showDetails = import.meta.env.DEV;
      return (
        <main className="min-h-screen bg-[#050b16] px-5 py-16 text-[#f5f7fb] sm:px-8 sm:py-24">
          <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center border-l-2 border-[#38bdf8] pl-6 sm:pl-10">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#67e8f9]">
              arquivo / falha inesperada
            </p>
            <div className="mb-6 flex items-center gap-4">
              <AlertTriangle className="h-9 w-9 text-[#fbbf24]" aria-hidden="true" />
              <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#94a3b8]">
                erro 500
              </p>
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Algo saiu do percurso.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#a8b5c7] sm:text-lg">
              A página encontrou uma falha inesperada. Tente recarregar ou volte ao início do arquivo para continuar navegando.
            </p>
            {showDetails && this.state.error ? (
              <pre className="mt-8 max-h-40 overflow-auto border border-white/10 bg-white/[0.03] p-4 font-mono text-xs leading-5 text-[#94a3b8]">
                {this.state.error.stack}
              </pre>
            ) : null}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button onClick={this.handleReload} className="bg-[#38bdf8] text-[#06111f] hover:bg-[#67e8f9]">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Tentar novamente
              </Button>
              <Button onClick={this.handleHome} variant="outline" className="border-white/20 bg-transparent text-[#f5f7fb] hover:bg-white/10 hover:text-white">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Voltar ao início
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
