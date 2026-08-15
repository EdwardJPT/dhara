export function ErrorMessage({ errorMessage, setErrorMessage }) {
  return (
    <div
      class="fixed top-1/2 left-1/2 z-11 flex h-40 w-9/10 -translate-1/2 items-center justify-center rounded-md border border-background bg-background px-5 py-8 text-white shadow-lg md:w-fit">
      <span
        onClick={() => {
          setErrorMessage("");
          setTimeout(() => { location.reload() }, 2000);
        }}
        class="absolute top-2 right-2 cursor-pointer text-2xl font-extrabold text-white"
      >
        &#x2715;
      </span>
      <div class="flex flex-col items-center justify-center">
        <p class="text-center text-xl font-extrabold">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}
