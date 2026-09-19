import React from 'react';
import { ShoppingBag, Calendar, FileText, Package, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Empty State Component
 * Shows friendly messages when no data is available
 */

export const EmptyState = ({ 
  type = 'orders', 
  title, 
  message, 
  actionLabel, 
  actionLink,
  onAction 
}) => {
  const icons = {
    orders: ShoppingBag,
    appointments: Calendar,
    prescriptions: FileText,
    products: Package,
    wishlist: Heart,
  };

  const defaultContent = {
    orders: {
      title: 'No orders yet',
      message: 'Your remedy orders and shipments will show up here.',
      actionLabel: 'Browse Medicines',
      actionLink: '/shop',
    },
    appointments: {
      title: 'No consultations scheduled',
      message: 'Book an appointment with Dr. Bharathi for personalized treatment.',
      actionLabel: 'Book Appointment',
      actionLink: '/appointment',
    },
    prescriptions: {
      title: 'No prescriptions found',
      message: 'Doctor prescriptions and dosage instructions will appear here after consultation.',
      actionLabel: null,
      actionLink: null,
    },
    products: {
      title: 'No products found',
      message: 'Try adjusting your filters or search terms.',
      actionLabel: 'Clear Filters',
      actionLink: null,
    },
    wishlist: {
      title: 'Your wishlist is empty',
      message: 'Save your favorite products to buy them later.',
      actionLabel: 'Explore Products',
      actionLink: '/shop',
    },
  };

  const Icon = icons[type] || Package;
  const content = defaultContent[type] || defaultContent.orders;
  
  const finalTitle = title || content.title;
  const finalMessage = message || content.message;
  const finalActionLabel = actionLabel !== undefined ? actionLabel : content.actionLabel;
  const finalActionLink = actionLink !== undefined ? actionLink : content.actionLink;

  return (
    <div className="text-center py-10 sm:py-12 space-y-4 max-w-md mx-auto px-4">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
          {finalTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {finalMessage}
        </p>
      </div>

      {/* Action Button */}
      {finalActionLabel && (
        <div className="pt-2">
          {finalActionLink ? (
            <Link
              to={finalActionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4" />
              <span>{finalActionLabel}</span>
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4" />
              <span>{finalActionLabel}</span>
            </button>
          ) : null}
        </div>
      )}

      {/* Decorative Element */}
      <div className="flex justify-center gap-1 pt-4 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
};

export default EmptyState;
