<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="mytv_0"></a>my-tv</h1>
<p class="has-line-data" data-line-start="2" data-line-end="3">my-tv 是一个用于个人托管和管理直播源的项目，旨在自动从多个网站获取最新的直播源，并对这些直播源进行整理、分类和去重处理。该项目适合用于个人学习、探索自动化脚本和 IPTV 直播源管理。</p>
<h2 class="code-line" data-line-start=4 data-line-end=5 ><a id="_4"></a>功能介绍</h2>
<ul>
<li class="has-line-data" data-line-start="6" data-line-end="7"><strong>自动获取直播源</strong>：项目从多个指定的网站自动获取最新的直播源，支持 M3U 和 TXT 格式的源文件。</li>
<li class="has-line-data" data-line-start="7" data-line-end="8"><strong>分类与整理</strong>：自动根据节目名称对直播源进行分组整理，并对重复的源链接进行去重。</li>
<li class="has-line-data" data-line-start="8" data-line-end="9"><strong>支持 IPv4 和 IPv6</strong>：可以识别并分类不同类型的 IP 源地址，分为 IPv4 和 IPv6 进行整理。</li>
<li class="has-line-data" data-line-start="9" data-line-end="11"><strong>输出格式</strong>：抓取和整理后的直播源保存为 <code>final_streams.txt</code> 文件，方便进一步处理和使用。</li>
</ul>
<h2 class="code-line" data-line-start=11 data-line-end=12 ><a id="_11"></a>项目结构</h2>
<pre><code class="has-line-data" data-line-start="14" data-line-end="24" class="language-bash">my-tv/
  ├── .github/
  │   └── workflows/
  │       └── schedule_run.yml  <span class="hljs-comment"># 定时任务的 GitHub Actions 工作流</span>
  ├── fetch_streams.py           <span class="hljs-comment"># 主要的直播源抓取和整理脚本</span>
  ├── final_streams.txt          <span class="hljs-comment"># 保存抓取和整理后的直播源文件</span>
  └── README.md                  <span class="hljs-comment"># 项目介绍文件</span>


</code></pre>
<h2 class="code-line" data-line-start=25 data-line-end=26 ><a id="GitHub_Actions__25"></a>GitHub Actions 定时任务</h2>
<p class="has-line-data" data-line-start="27" data-line-end="28">项目已经配置了 GitHub Actions 工作流（<code>.github/workflows/schedule_run.yml</code>），它会每天 UTC 时间的 00:00 和 12:00 自动运行脚本抓取最新的直播源，并将结果推送到仓库。</p>
<h3 class="code-line" data-line-start=29 data-line-end=30 ><a id="_29"></a><strong>法律声明</strong></h3>
<p class="has-line-data" data-line-start="31" data-line-end="32">&lt;span style=“color:red;”&gt;<strong>此项目仅用于学习和研究目的。使用者在使用该项目时应遵守当地法律法规。请勿将此项目用于任何违反法律的活动。项目作者不对因使用此项目造成的任何法律问题负责。</strong>&lt;/span&gt;</p>
