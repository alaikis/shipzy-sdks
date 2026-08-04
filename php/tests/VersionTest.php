<?php

namespace Zymeup\SDK\Tests;

use PHPUnit\Framework\TestCase;
use Zymeup\SDK\ZymeupClient;

final class VersionTest extends TestCase
{
    public function testVersionConstant(): void
    {
        $this->assertSame('2.0.1', ZymeupClient::VERSION);
    }
}
