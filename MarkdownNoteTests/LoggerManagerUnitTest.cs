using LoggerService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace MarkdownNoteTests
{
    public class LoggerManagerUnitTest : ILoggerManager
    {
        private readonly ITestOutputHelper _output;
        public LoggerManagerUnitTest(ITestOutputHelper output)
        {
            _output = output;
        }
        public void LogDebug(string message)
        {
            _output.WriteLine($"DEBUG: {message}");
        }

        public void LogError(string message)
        {
            _output.WriteLine($"ERROR: {message}");
        }

        public void LogInfo(string message)
        {
            _output.WriteLine($"INFO: {message}");
        }

        public void LogWarn(string message)
        {
            _output.WriteLine($"WARN: {message}");
        }
    }
}
