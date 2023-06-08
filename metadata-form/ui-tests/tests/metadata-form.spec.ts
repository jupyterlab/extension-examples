import { expect, test, IJupyterLabPageFixture } from '@jupyterlab/galata';

/**
 * Activate notebook tools side bar.
 */
async function activatePropertyInspector(page: IJupyterLabPageFixture) {
  if ((await page.locator('.jp-NotebookTools').count()) > 0) {
    if (await page.locator('.jp-NotebookTools').isVisible()) {
      return;
    }
  }

  const widgetButton = page.locator(
    ".lm-TabBar-tab[title='Property Inspector']"
  );
  const buttonPosition = await widgetButton.boundingBox();

  if (buttonPosition === null)
    throw new Error(
      'Cannot get the position of the property inspector button.'
    );

  await page.mouse.click(
    buttonPosition.x + buttonPosition.width / 2,
    buttonPosition.y + buttonPosition.height / 2
  );

  await expect(page.locator('.jp-NotebookTools')).toBeVisible();
}

test('should create the two example forms', async ({ page }) => {
  page.notebook.createNew('metadata-form');

  await activatePropertyInspector(page);

  // Retrieves the forms from its header's text, it should be collapsed.
  const simpleForm = page.locator('.jp-NotebookTools .jp-Collapse', {
    hasText: 'simple example'
  });
  const advancedForm = page.locator('.jp-NotebookTools .jp-Collapse', {
    hasText: 'advanced example'
  });

  // Expand the simple example form.
  await simpleForm.click();

  // Get the formGroup (form content).
  const simpleFormGroup = simpleForm.locator(
    '.jp-Collapse-contents .jp-MetadataForm fieldset > .form-group'
  );

  await expect.soft(simpleFormGroup).toHaveCount(2);
  expect.soft(await simpleForm.screenshot()).toMatchSnapshot('simple-form.png');

  // Collapse the simple example form.
  await simpleForm.click();

  // Expand the simple example form.
  await advancedForm.click();

  // Get the formGroup (form content).
  const advancedFormGroup = advancedForm.locator(
    '.jp-Collapse-contents .jp-MetadataForm fieldset > .form-group'
  );

  // Should display 6 fields (the conditional should be there)
  await expect.soft(advancedFormGroup).toHaveCount(6);
  expect(await advancedForm.screenshot()).toMatchSnapshot('advanced-form.png');
});
