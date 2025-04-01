import React from 'react';
import useScriptStore from '../store/scriptStore';

const TitlePageEditor: React.FC = () => {
  const { titlePage, updateTitlePage } = useScriptStore();

  const handleChange = (field: keyof typeof titlePage) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateTitlePage({ [field]: e.target.value });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Title Page</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={titlePage.title}
                  onChange={handleChange('title')}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter screenplay title"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={titlePage.author}
                  onChange={handleChange('author')}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Information
                </label>
                <input
                  id="contact"
                  type="text"
                  value={titlePage.contact}
                  onChange={handleChange('contact')}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter contact information"
                />
              </div>

              <div>
                <label htmlFor="copyright" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Copyright
                </label>
                <input
                  id="copyright"
                  type="text"
                  value={titlePage.copyright}
                  onChange={handleChange('copyright')}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter copyright information"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="text"
                  value={titlePage.date}
                  onChange={handleChange('date')}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter date"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={titlePage.notes}
                  onChange={handleChange('notes')}
                  rows={4}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400
                    resize-none"
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">Preview</h3>
              <div className="font-mono space-y-4 p-8 border dark:border-gray-700 rounded-lg">
                <div className="text-center space-y-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{titlePage.title}</h1>
                  {titlePage.author && (
                    <p className="text-lg text-gray-800 dark:text-gray-200">by<br />{titlePage.author}</p>
                  )}
                  {titlePage.contact && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">{titlePage.contact}</p>
                  )}
                  <div className="text-sm space-y-2">
                    {titlePage.copyright && <p className="text-gray-600 dark:text-gray-400">{titlePage.copyright}</p>}
                    {titlePage.date && <p className="text-gray-600 dark:text-gray-400">{titlePage.date}</p>}
                  </div>
                  {titlePage.notes && (
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">{titlePage.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitlePageEditor;