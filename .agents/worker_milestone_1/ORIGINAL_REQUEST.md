## 2026-07-10T04:00:33Z
Modify `src/app/list-car/page.tsx` to support entering a custom image URL.
Requirements:
1. In Step 2 (Select Car Template Styling) of the multi-step listing form, add a text input field for a custom image URL.
   - Label: 'Or Provide a Custom Image URL'
   - Placeholder: 'https://example.com/your-car.jpg'
   - Add a helper text explaining that if provided, this URL will override the selected template.
2. In the `handleSubmit` method of `ListCarPage`, extract the custom image URL. If a non-empty custom image URL is provided (whitespace trimmed), append it to `formData` under the key `"image"`, overriding the selected template image.
3. Make sure all styling and JSX remains valid and consistent with the rest of the application.
4. Run `npm run build` to verify that the application compiles cleanly. Run `npx vitest run` to verify that unit tests pass.
5. Document all changes in `/Users/omtomar/Documents/PhillipCars/novaride/.agents/worker_milestone_1/changes.md`.
6. Send a handoff message when completed, including the build and test results.
