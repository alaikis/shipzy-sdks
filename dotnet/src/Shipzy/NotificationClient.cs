using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class NotificationClient : ShipzyHttpClient
    {
        public NotificationClient(ZymeupConfig config) : base(config) { }
    }
}