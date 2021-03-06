/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {

  // Define template paths to load
  const templatePaths = [

    // Actor Sheet Partials
    "systems/kryx_rpg/templates/actors/parts/actor-traits.html",
    "systems/kryx_rpg/templates/actors/parts/actor-inventory.html",
    "systems/kryx_rpg/templates/actors/parts/actor-features.html",
    "systems/kryx_rpg/templates/actors/parts/actor-arsenal.html",

    // Item Sheet Partials
    "systems/kryx_rpg/templates/items/parts/item-action.html",
    "systems/kryx_rpg/templates/items/parts/item-activation.html",
    "systems/kryx_rpg/templates/items/parts/item-description.html"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
