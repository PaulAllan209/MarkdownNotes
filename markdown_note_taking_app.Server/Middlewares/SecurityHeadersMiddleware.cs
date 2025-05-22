namespace markdown_note_taking_app.Server.Middlewares
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Add security headers to help prevent common web vulnerabilities

            // Prevents MIME type sniffing
            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");

            // Controls how the site can be framed - prevents clickjacking
            context.Response.Headers.Add("X-Frame-Options", "DENY");

            // Enables browser's XSS protection
            context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

            // Controls how much referrer information should be included
            context.Response.Headers.Add("Referrer-Policy", "no-referrer");

            // Controls which resources can be loaded
            context.Response.Headers.Add("Content-Security-Policy",
                "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'");

            // Restricts what browser features the site can use
            context.Response.Headers.Add("Permissions-Policy",
                "camera=(), microphone=(), geolocation=()");

            await _next(context);
        }
    }
}
