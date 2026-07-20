<?php
namespace Shipzy\Sdk\Tests;

use PHPUnit\Framework\TestCase;
use Shipzy\Sdk\Shared\Version;

final class VersionTest extends TestCase
{
    public function testVersionConstant(): void
    {
        $this->assertSame('0.1.0-alpha.1', Version::CURRENT);
    }
}
