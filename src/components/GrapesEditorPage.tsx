
'use client';

import { useEffect, useRef } from 'react';
import 'grapesjs/dist/css/grapes.min.css';

declare global {
  interface Window {
    editor: any;
  }
}

export default function GrapesEditorPage() {
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('grapesjs').then((module) => {
        const grapesjs = module.default;
        if (!editorRef.current) return;

        const editor = grapesjs.init({
          container: '#gjs',
          height: '100vh',
          width: 'auto',
          fromElement: true,
          storageManager: false,
          plugins: [],
          canvas: {
            styles: [
              'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
            ]
          }
        });

        editor.setComponents(`
          <div class="col-lg-6">
            <div class="furniture-banner position-relative overflow-hidden rounded shadow-lg" style="background-image: url('https://via.placeholder.com/600x300'); min-height: 430px;" data-gjs-custom-name="Banner" data-gjs-editable="true" data-gjs-resizable="false" data-gjs-draggable="false">
              <div class="info-box text-white p-4" style="background-color: #0da79e; max-width: 312px; border-top-right-radius: 58px; border-bottom-right-radius: 58px; margin-top: 73px; margin-left: 1px;">
                <img src="https://via.placeholder.com/108x40" style="width: 108px" class="mb-2" />
                <img src="https://via.placeholder.com/190x50" style="width: 190px" class="mb-3" />
                <ul class="list-unstyled fs-6">
                  <li class="mb-2">• 36-Month Warranty Available</li>
                  <li class="mb-2">• EMI starting from ₹1,825/month</li>
                  <li class="mb-2">• Express Shipping in 1 day</li>
                </ul>
                <div class="Shop align-items-center">
                  <a href="shop.php" class="btn btn-light rounded-pill px-4 text-dark">Shop Now</a>
                  <img src="https://via.placeholder.com/21x21" style="width: 21px" class="me-4" />
                </div>
              </div>
            </div>
          </div>
        `);

        const bannerBlock = editor.getWrapper().find('.furniture-banner')[0];
        if (bannerBlock) {
          bannerBlock.addTrait([
            {
              type: 'text',
              label: 'Background Image URL',
              name: 'background-image',
              changeProp: true
            }
          ]);
          bannerBlock.setStyle({ backgroundImage: "url('https://via.placeholder.com/600x300')" });
        }

        window.editor = editor;
      });
    }
  }, []);

  return (
    <div id="gjs" ref={editorRef} style={{ height: '100vh' }}></div>
  );
}
