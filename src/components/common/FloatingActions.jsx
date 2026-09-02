import React from 'react';

export const FloatingActions = () => {
  const actions = [
    {
      id: 'call',
      label: 'Call Now',
      href: 'tel:+919025854711',
      target: '_self',
      iconClass: 'fa-solid fa-phone',
      circleBg: 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-sm',
      bgColor: 'bg-[#236888] hover:bg-[#184d66]',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/919025854711',
      target: '_blank',
      iconClass: 'fa-brands fa-whatsapp',
      circleBg: 'bg-[#25D366] text-white shadow-sm',
      bgColor: 'bg-[#236888] hover:bg-[#184d66]',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/_drbharathi',
      target: '_blank',
      iconClass: 'fa-brands fa-instagram',
      circleBg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm',
      bgColor: 'bg-[#236888] hover:bg-[#184d66]',
    }
  ];

  return (
    <aside 
      aria-label="Quick contact links"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-stretch shadow-2xl rounded-l-2xl overflow-hidden bg-[#236888] divide-y divide-[#1c5a77] border-l border-t border-b border-[#1c5a77]"
    >
      {actions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          target={action.target}
          rel={action.target === '_blank' ? 'noopener noreferrer' : undefined}
          className="group flex flex-col items-center justify-center p-2 sm:p-2.5 xl:py-2.5 xl:px-2.5 w-10 sm:w-11 xl:w-[68px] transition-all duration-200 hover:-translate-x-1 hover:bg-[#184d66] text-white"
          title={action.label}
          aria-label={action.label}
        >
          {/* Circular Icon */}
          <div className={`w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm xl:text-base transition-transform duration-200 group-hover:scale-110 ${action.circleBg}`}>
            <i className={action.iconClass}></i>
          </div>

          {/* Label - Visible only on XL desktop, hidden on Mobile & Tablet */}
          <span className="hidden xl:block text-[10px] xl:text-[11px] font-black tracking-tight mt-1 text-center text-white leading-tight">
            {action.label}
          </span>
        </a>
      ))}
    </aside>
  );
};
