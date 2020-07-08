/**
 * A specialized form used to select from a checklist of attributes, traits, or properties
 * @extends {FormApplication}
 */
import {KRYX_RPG} from '../config.js';

export default class TraitSelector extends FormApplication {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "trait-selector",
      classes: ["kryx_rpg"],
      title: "Actor Trait Selection",
      template: "systems/kryx_rpg/templates/apps/trait-selector.html",
      width: 320,
      height: "auto",
      choices: {},
      allowCustom: true,
      minimum: 0,
      maximum: null
    });
  }

  /* -------------------------------------------- */

  /**
   * Return a reference to the target attribute
   * @type {String}
   */
  get attribute() {
    return this.options.name;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {

    // Get current values
    let attr = getProperty(this.object.data, this.attribute) || {};
    attr.value = attr.value || [];

    // Populate choices
    const choices = duplicate(this.options.choices);
    const choices_ordered = {}
    for (let [k, v] of Object.entries(choices)) {
      let order = k
      const ordering = KRYX_RPG[this.attribute + ".ordering"]
      if (ordering) {
        // special workaround so that armors can be shown in order (grep data.traits.armorProf)
        order = ordering[k]
      }
      choices_ordered[order] = {
        key: k,
        choice: {
          label: v,
          chosen: attr ? attr.value.includes(k) : false
        }
      }
    }

    // Return data
    return {
      allowCustom: this.options.allowCustom,
      choices_ordered: choices_ordered,
      custom: attr ? attr.custom : ""
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {
    const updateData = {};

    // Obtain choices
    const chosen = [];
    for (let [k, v] of Object.entries(formData)) {
      if ((k !== "custom") && v) chosen.push(k);
    }
    updateData[`${this.attribute}.value`] = chosen;

    // Validate the number chosen
    if (this.options.minimum && (chosen.length < this.options.minimum)) {
      return ui.notifications.error(`You must choose at least ${this.options.minimum} options`);
    }
    if (this.options.maximum && (chosen.length > this.options.maximum)) {
      return ui.notifications.error(`You may choose no more than ${this.options.maximum} options`);
    }

    // Include custom
    if (this.options.allowCustom) {
      updateData[`${this.attribute}.custom`] = formData.custom;
    }

    // Update the object
    this.object.update(updateData);
  }
}
