import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";

export enum ConfirmType {
    Danger,
    Success,
    Neutral
}

interface ConfirmProps {
    title: string;
    desc: string;
    confirmType?: ConfirmType;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ 
    title,
    desc,
    confirmType, 
    isOpen, 
    onConfirm, 
    onCancel, 
    onClose 
}) => {
    let typeClass = "text-gray-900 bg-gray-100 hover:bg-gray-200"
    switch (confirmType) {
        case ConfirmType.Danger:
            typeClass = "text-red-900 bg-red-100 hover:bg-red-200"
            break;

        case ConfirmType.Success:
            typeClass = "text-green-900 bg-green-100 hover:bg-green-200"
    
        default:
            break;
    }

    const onButtonConfirmClick = () => {
        onConfirm();
    }
    const onButtonCancelClick = () => {
        onCancel();
    }
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={() => onClose()}
            >
                <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-50 backdrop-filter backdrop-blur-3xl" />
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                {title}
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {desc}
                                </p>
                            </div>

                            <div className="mt-4 gap-2 flex">
                                <button
                                    type="button"
                                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium ${typeClass} border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                                    onClick={() => onButtonConfirmClick()}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={() => onButtonCancelClick()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Confirm;