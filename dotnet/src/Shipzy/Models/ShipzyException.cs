using System;

namespace Shipzy.Sdk.Models
{
    public class ShipzyException : Exception
    {
        public int StatusCode { get; }

        public ShipzyException(string message, int statusCode) : base(message)
        {
            StatusCode = statusCode;
        }
    }

    public class ShipzyAuthException : ShipzyException
    {
        public ShipzyAuthException(string message) : base(message, 401) { }
    }
}
