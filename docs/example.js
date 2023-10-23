import Mustache from "mustache";
class TemplateExample extends HTMLElement {
  connectedCallback() {
    // Store the content of me and hide myself.
    const name = this.getAttribute("element-name");
    const content = this.innerHTML;
    this.style.display = "none";
    // Declare the element.
    const customElement = class extends HTMLElement {
      connectedCallback() {
        // Gather templating info.
        const attributeDict = {};
        for (let attribute of this.attributes) {
          const name = attribute.name;
          let value = attribute.value;
          if (!name.includes("array")) {
            attributeDict[name] = value;
          } else {
            // Allow arrays being made from multiple attributes.
            const arrayName = name.split("-")[0];
            if (!attributeDict[arrayName]) {
              attributeDict[arrayName] = [];
            }
            attributeDict[arrayName].push(value);
          }
        }
        // I mustache you a question.
        const html = Mustache.render(content, attributeDict);
        this.outerHTML = html;
      }
    };
    customElements.define(name, customElement);
  }
}
customElements.define("template-example", TemplateExample);
