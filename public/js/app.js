// Global app initializer (keeps page scripts safe when elements are absent)
document.addEventListener("DOMContentLoaded", () => {
  // Placeholder for global initialization. Device-specific logic moved to /js/devices.js

  // Make the top-left hamburger toggle the sidebar for users (adds/remove 'sidebar-collapse')
  document.querySelectorAll('[data-lte-toggle="sidebar"]').forEach(btn => {
    btn.addEventListener('click', function(e){
      e.preventDefault();
      document.body.classList.toggle('sidebar-collapse');
    });
  });
});