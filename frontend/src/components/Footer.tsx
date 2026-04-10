import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2">UrlShortener</h3>
                        <p className="text-gray-400 text-sm">
                            Simplifying your links, expanding your reach.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end space-y-2 text-sm text-gray-400">
                        <p className="font-medium text-white">Govindraj Pravinrao Wattamwar</p>
                        <p>Mobile: 9356027234</p>
                        <p>Email: govindraj120805@gmail.com</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} UrlShortener. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
