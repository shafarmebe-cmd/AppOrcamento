import React, { useState, useCallback, useMemo } from 'react';
import { QuoteData, QuoteItem } from './types';
import ImageUploader from './components/ImageUploader';
import BackgroundImageSelector from './components/BackgroundImageSelector';
import { PlusCircleIcon, TrashIcon, PrinterIcon, SpinnerIcon } from './components/icons';

const FONT_OPTIONS = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'];

const initialQuoteData: QuoteData = {
  headerImage: null,
  footerImage: null,
  clientName: 'Mauro e Jussara',
  services: [
    { id: '1', text: 'Substituição dos pisos de dois banheiros.', value: 1500 },
    { id: '2', text: 'Assentamento de piso.', value: 800 },
    { id: '3', text: 'Retirada dos pisos.', value: 300 },
    { id: '4', text: 'Retirada da argamassa.', value: 250 },
  ],
  observations: [
    { id: '1', text: 'Orçamento de mão de obra.' },
    { id: '2', text: 'Tempo estimado 5 dias.' },
  ],
  details: [
    { id: '1', text: '4m² de piso por banheiro.' },
    { id: '2', text: 'Rejunte incluso.', value: 50 },
  ],
  backgroundImage: null,
  backgroundOpacity: 0.1,
  fontFamily: 'Arial',
  textColor: '#1f2937', // gray-800
  headerType: 'image',
  footerType: 'image',
  companyName: 'M3 MANUTENÇÕES E REFORMAS',
  email: 'seuemail@exemplo.com',
  phone: '(XX) 99999-9999',
  companyLogo: null,
};

// Helper to format currency
const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};


const QuoteItemInput: React.FC<{
  item: QuoteItem;
  onItemChange: (id: string, text: string, value: string) => void;
  onRemove: (id: string) => void;
}> = ({ item, onItemChange, onRemove }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <input
        type="text"
        placeholder="Descrição do item"
        value={item.text}
        onChange={(e) => onItemChange(item.id, e.target.value, String(item.value || ''))}
        className="flex-grow bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-teal-300 focus:border-teal-500 sm:text-sm p-2"
      />
      <div className="relative w-32">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
          <input
            type="number"
            placeholder="Valor"
            value={item.value || ''}
            onChange={(e) => onItemChange(item.id, item.text, e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-teal-300 focus:border-teal-500 sm:text-sm p-2 pl-8"
            step="0.01"
            min="0"
          />
      </div>
      <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1">
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const QuoteSection: React.FC<{
  title: string;
  items: QuoteItem[];
  setItems: (items: QuoteItem[]) => void;
}> = ({ title, items, setItems }) => {
  const handleItemChange = (id: string, text: string, value: string) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const numValue = parseFloat(value);
        return { ...item, text, value: isNaN(numValue) ? undefined : numValue };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{title}</h3>
      {items.map(item => (
        <QuoteItemInput key={item.id} item={item} onItemChange={handleItemChange} onRemove={handleRemoveItem} />
      ))}
      <button onClick={handleAddItem} className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
        <PlusCircleIcon className="w-5 h-5 mr-1" />
        Adicionar Item
      </button>
    </div>
  );
};

const TemplateHeader: React.FC<{ companyName: string, email: string, phone: string, logo: string | null }> = ({ companyName, email, phone, logo }) => (
    <div className="p-4 bg-gray-100/80 rounded-t-lg border-b-2 border-gray-300 flex items-center justify-center space-x-4">
        {logo && <img src={logo} alt="Logo da Empresa" className="max-h-16 object-contain" />}
        <div className={logo ? 'text-left' : 'text-center'}>
            <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
            <p className="text-sm text-gray-600">{email} | {phone}</p>
        </div>
    </div>
);

const TemplateFooter: React.FC<{ companyName: string }> = ({ companyName }) => (
     <div className="p-3 bg-gray-100/80 rounded-b-lg border-t-2 border-gray-300 text-center">
        <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} {companyName}. Todos os direitos reservados.</p>
    </div>
);


const App: React.FC = () => {
  const [quoteData, setQuoteData] = useState<QuoteData>(initialQuoteData);

  const updateQuoteData = (field: keyof QuoteData, value: any) => {
    setQuoteData(prev => ({...prev, [field]: value }));
  };
  
  const updateSectionItems = (section: 'services' | 'observations' | 'details') => (newItems: QuoteItem[]) => {
      updateQuoteData(section, newItems);
  };

  const total = useMemo(() => {
    return [...quoteData.services, ...quoteData.observations, ...quoteData.details]
      .reduce((sum, item) => sum + (item.value || 0), 0);
  }, [quoteData.services, quoteData.observations, quoteData.details]);
  
  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <header className="bg-white shadow-md p-4 no-print sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
                Construtor de Orçamentos PRO
            </h1>
            <button
                onClick={handlePrint}
                className="flex items-center justify-center px-6 py-3 w-60 bg-teal-500 text-white font-bold rounded-lg border border-teal-600 shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-105"
            >
                <PrinterIcon className="w-5 h-5 mr-2" />
                Imprimir / Salvar PDF
            </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="no-print bg-white p-6 rounded-lg shadow-xl space-y-8 h-fit border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-teal-300 pb-3">
            ✨ Personalize seu Orçamento
          </h2>
          
           {/* Header & Footer Controls */}
          <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">🖼️ Identidade Visual</h3>
              <ImageUploader
                label="Logo da Empresa"
                recommendedDimensions="Recomendado: 200x80px"
                onImageUpload={(img) => updateQuoteData('companyLogo', img)}
                currentImage={quoteData.companyLogo}
              />
              <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Cabeçalho</label>
                  <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg border">
                       <label className="flex-1 text-center p-2 rounded-md cursor-pointer transition-colors" style={{backgroundColor: quoteData.headerType === 'image' ? '#14b8a6' : 'transparent', color: quoteData.headerType === 'image' ? 'white' : 'black'}}><input type="radio" name="headerType" value="image" checked={quoteData.headerType === 'image'} onChange={(e) => updateQuoteData('headerType', e.target.value)} className="sr-only"/> Imagem</label>
                       <label className="flex-1 text-center p-2 rounded-md cursor-pointer transition-colors" style={{backgroundColor: quoteData.headerType === 'template' ? '#14b8a6' : 'transparent', color: quoteData.headerType === 'template' ? 'white' : 'black'}}><input type="radio" name="headerType" value="template" checked={quoteData.headerType === 'template'} onChange={(e) => updateQuoteData('headerType', e.target.value)} className="sr-only"/> Modelo de Texto</label>
                  </div>
                  {quoteData.headerType === 'image' ? (
                       <ImageUploader label="Arquivo do Cabeçalho" recommendedDimensions="Recomendado: 800x150px" onImageUpload={(img) => updateQuoteData('headerImage', img)} currentImage={quoteData.headerImage} />
                  ) : (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-md border">
                          <input type="text" placeholder="Nome da Empresa" value={quoteData.companyName} onChange={(e) => updateQuoteData('companyName', e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-teal-300 focus:border-teal-500" />
                          <input type="email" placeholder="Email de Contato" value={quoteData.email} onChange={(e) => updateQuoteData('email', e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-teal-300 focus:border-teal-500" />
                          <input type="tel" placeholder="Telefone / WhatsApp" value={quoteData.phone} onChange={(e) => updateQuoteData('phone', e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-teal-300 focus:border-teal-500" />
                      </div>
                  )}
              </div>
               <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Rodapé</label>
                   <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg border">
                       <label className="flex-1 text-center p-2 rounded-md cursor-pointer transition-colors" style={{backgroundColor: quoteData.footerType === 'image' ? '#14b8a6' : 'transparent', color: quoteData.footerType === 'image' ? 'white' : 'black'}}><input type="radio" name="footerType" value="image" checked={quoteData.footerType === 'image'} onChange={(e) => updateQuoteData('footerType', e.target.value)} className="sr-only" /> Imagem</label>
                       <label className="flex-1 text-center p-2 rounded-md cursor-pointer transition-colors" style={{backgroundColor: quoteData.footerType === 'template' ? '#14b8a6' : 'transparent', color: quoteData.footerType === 'template' ? 'white' : 'black'}}><input type="radio" name="footerType" value="template" checked={quoteData.footerType === 'template'} onChange={(e) => updateQuoteData('footerType', e.target.value)} className="sr-only" /> Modelo de Texto</label>
                  </div>
                  {quoteData.footerType === 'image' && (
                       <ImageUploader label="Arquivo do Rodapé" recommendedDimensions="Recomendado: 800x100px" onImageUpload={(img) => updateQuoteData('footerImage', img)} currentImage={quoteData.footerImage} />
                  )}
              </div>
          </div>
          
          <BackgroundImageSelector
            currentImage={quoteData.backgroundImage}
            currentOpacity={quoteData.backgroundOpacity}
            onImageSelect={(img) => updateQuoteData('backgroundImage', img)}
            onOpacityChange={(opacity) => updateQuoteData('backgroundOpacity', opacity)}
          />
          
           {/* Style Controls */}
           <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">🎨 Estilo e Cores</h3>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">Fonte do Texto</label>
                      <select id="fontFamily" value={quoteData.fontFamily} onChange={(e) => updateQuoteData('fontFamily', e.target.value)} className="mt-1 block w-full p-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-teal-300 focus:border-teal-500">
                          {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">Cor Principal</label>
                      <input type="color" id="textColor" value={quoteData.textColor} onChange={(e) => updateQuoteData('textColor', e.target.value)} className="mt-1 block w-full h-10 p-1 border-gray-300 rounded-md shadow-sm cursor-pointer" />
                  </div>
              </div>
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
            <input
              type="text"
              id="clientName"
              value={quoteData.clientName}
              onChange={(e) => updateQuoteData('clientName', e.target.value)}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-teal-300 focus:border-teal-500 sm:text-sm p-2"
            />
          </div>

          <QuoteSection title="✅ Serviços / Itens" items={quoteData.services} setItems={updateSectionItems('services')} />
          <QuoteSection title="📝 Observações Importantes" items={quoteData.observations} setItems={updateSectionItems('observations')} />
          <QuoteSection title="📌 Detalhes Adicionais" items={quoteData.details} setItems={updateSectionItems('details')} />
        </div>

        {/* A4 Preview */}
        <div className="flex justify-center items-start">
            <div id="pdf-preview" className="print-container relative w-full bg-white shadow-2xl rounded-lg" style={{ width: '210mm', minHeight: '297mm' }}>
                {quoteData.backgroundImage && (
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center -z-10"
                        style={{
                            backgroundImage: `url(${quoteData.backgroundImage})`,
                            opacity: quoteData.backgroundOpacity,
                        }}
                    ></div>
                )}
                <div className="flex flex-col justify-between" style={{ minHeight: '297mm', fontFamily: quoteData.fontFamily, color: quoteData.textColor }}>
                    <header>
                        {quoteData.headerType === 'image' ? (
                          quoteData.headerImage ? (
                            <img src={quoteData.headerImage} alt="Cabeçalho" className="w-full h-auto object-contain" style={{ maxHeight: '4cm' }} />
                          ) : (
                            <div className="h-24 bg-gray-200/50 flex items-center justify-center text-gray-500 m-4 rounded">
                                Cabeçalho (800x150px)
                            </div>
                          )
                        ) : (
                          <TemplateHeader companyName={quoteData.companyName} email={quoteData.email} phone={quoteData.phone} logo={quoteData.companyLogo} />
                        )}
                    </header>
                    <main className="flex-grow py-8 px-10">
                      <h2 className="text-xl font-bold mb-4 border-b-2 pb-2">ORÇAMENTO DE PRESTAÇÃO DE SERVIÇOS</h2>
                      <p className="mb-6"><span className="font-semibold">Cliente:</span> {quoteData.clientName}</p>

                      <div className="space-y-4">
                          {quoteData.services.length > 0 && (
                            <ul className="space-y-2">
                              {quoteData.services.map(item => item.text && (
                                <li key={item.id} className="flex justify-between items-start border-b border-gray-200/80 py-1">
                                  <span>- {item.text}</span>
                                  <span className="font-mono text-right pl-4 whitespace-nowrap">{formatCurrency(item.value)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {quoteData.observations.length > 0 && (
                            <div>
                               <h3 className="font-semibold text-lg my-3 pt-3 border-t">Observações:</h3>
                               <ul className="list-disc list-inside space-y-2">
                                  {quoteData.observations.map(item => item.text && (
                                    <li key={item.id} className="flex justify-between items-start">
                                      <span>{item.text}</span>
                                      <span className="font-mono text-right pl-4 whitespace-nowrap">{formatCurrency(item.value)}</span>
                                    </li>
                                  ))}
                                </ul>
                            </div>
                           )}

                           {quoteData.details.length > 0 && (
                                <ul className="list-disc list-inside space-y-2 pt-3">
                                {quoteData.details.map(item => item.text && (
                                    <li key={item.id} className="flex justify-between items-start">
                                    <span>{item.text}</span>
                                    <span className="font-mono text-right pl-4 whitespace-nowrap">{formatCurrency(item.value)}</span>
                                    </li>
                                ))}
                                </ul>
                           )}
                      </div>

                      {total > 0 && (
                          <div className="mt-12 pt-4 border-t-2 border-gray-400 flex justify-end items-center">
                              <span className="text-xl font-bold mr-4">TOTAL:</span>
                              <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                          </div>
                      )}

                    </main>
                    <footer>
                         {quoteData.footerType === 'image' ? (
                             quoteData.footerImage ? (
                                <img src={quoteData.footerImage} alt="Rodapé" className="w-full h-auto object-contain" style={{ maxHeight: '3cm' }}/>
                            ) : (
                                <div className="h-20 bg-gray-200/50 flex items-center justify-center text-gray-500 m-4 rounded">
                                    Rodapé (800x100px)
                                </div>
                            )
                         ) : (
                             <TemplateFooter companyName={quoteData.companyName} />
                         )}
                    </footer>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;