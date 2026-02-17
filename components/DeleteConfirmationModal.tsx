import React, { useState } from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: 'project' | 'account' | 'document';
    title?: string;
    description?: string;
    confirmText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    title,
    description,
    confirmText
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const confirmationString = itemType === 'account' ? 'delete my account' : itemName;
    const isMatch = inputValue === confirmationString;

    const handleConfirm = async () => {
        if (!isMatch) return;
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-border-dark bg-sidebar-dark flex items-center justify-between">
                    <h3 className="text-lg font-bold text-text-primary">
                        {title || `Delete ${itemType}`}
                    </h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4 flex gap-3 text-red-200 text-sm">
                        <span className="material-symbols-outlined text-red-400 shrink-0">warning</span>
                        <p>{description || 'This action cannot be undone. This will permanently delete the ' + itemType + ' and all associated data.'}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">
                            Please type <span className="font-mono font-bold text-text-primary select-all">{confirmationString}</span> to confirm.
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono text-sm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={confirmationString}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-sidebar-dark border-t border-border-dark flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isMatch || isDeleting}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Deleting...
                            </>
                        ) : (
                            confirmText || 'Delete permanently'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
