import React from 'react';
import { Copy, Check, Info } from 'lucide-react';

interface PaymentDetailsProps {
  aliasBancario: string;
  titularCuenta: string;
  copiedAlias: boolean;
  onCopyAlias: () => void;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  aliasBancario,
  titularCuenta,
  copiedAlias,
  onCopyAlias,
}) => {
  return (
    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
        <span className="text-[11px] font-bold text-stone-700">
          Datos para transferencia
        </span>
        <span className="text-[10px] bg-stone-200/60 text-stone-700 px-2 py-0.5 rounded font-mono font-medium border border-stone-300/60">
          CBU / CVU / Alias
        </span>
      </div>

      <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-stone-500 block">
              Alias bancario
            </span>
            <span className="font-mono font-bold text-stone-900 text-sm sm:text-base select-all truncate block tabular-nums">
              {aliasBancario}
            </span>
          </div>

          <button
            type="button"
            onClick={onCopyAlias}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer active:scale-95 shrink-0 border ${
              copiedAlias
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
            }`}
            title="Copiar alias al portapapeles"
          >
            {copiedAlias ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>Copiar alias</span>
              </>
            )}
          </button>
        </div>

        <div className="border-t border-stone-100 pt-2">
          <span className="text-[10px] font-semibold text-stone-500 block">
            Titular de la cuenta
          </span>
          <span className="text-xs font-semibold text-stone-800">
            {titularCuenta}
          </span>
        </div>
      </div>

      <p className="text-xs text-stone-600 flex items-center gap-2 bg-[#FAF1ED] p-2.5 rounded-xl border border-[#EADBD5] leading-tight">
        <Info className="w-4 h-4 text-[#D9532F] shrink-0" />
        <span>Copiá el alias, realizá la transferencia y adjuntá el comprobante al enviar por WhatsApp.</span>
      </p>
    </div>
  );
};

export default PaymentDetails;
